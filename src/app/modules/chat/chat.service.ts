import {inject, Injectable} from '@angular/core';
import {signal, computed, effect} from '@angular/core';
import {ChatMessage, UserStatus} from './chat.types';
import {RxStompService} from "../../core/ws/rx-stomp.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {data} from "autoprefixer";

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:8081/api';

  private messages = signal<ChatMessage[]>([]);
  private userStatus = signal<UserStatus | null>(null);
  private messageChunks = signal<{ [messageId: string]: ChatMessage[] }>({});
  private stompService: RxStompService = inject(RxStompService);

  user = computed(() => this.userStatus());

  private http: HttpClient = inject(HttpClient);

  constructor() {
   // this.initializeSubscriptions();
    //this.assembleChunksEffect();
    this.testEndpoints()
  }

  private initializeSubscriptions(): void {
    // Assuming '/topic/chatMessageChunks' is the destination for chunked messages
    this.stompService.watch('/app/user/queue/message').subscribe({
      next: (message) => {
        console.log(message)
        const chunk: ChatMessage = JSON.parse(message.body);
        this.handleMessageChunk(chunk);
      },
    });

    // Other subscriptions remain the same
  }

  private handleMessageChunk(chunk: ChatMessage): void {
    this.messageChunks.update((currentChunks) => {
      const chunks = currentChunks[chunk.messageId] || [];
      return {...currentChunks, [chunk.messageId]: [...chunks, chunk]};
    });
  }

  private assembleChunksEffect(): void {
    effect(() => {
      const chunks = this.messageChunks();
      Object.keys(chunks).forEach((messageId) => {
        const messageParts = chunks[messageId];
        // Define your logic to determine if all chunks have been received
        if (this.isComplete(messageParts)) {
          const fullMessage = this.assembleMessage(messageParts);
          this.messages.update((msgs) => [...msgs, fullMessage]);
          // Remove processed chunks
          const updatedChunks = {...chunks};
          delete updatedChunks[messageId];
          this.messageChunks.set(updatedChunks);
        }
      });
    });
  }

  private isComplete(parts: ChatMessage[]): boolean {
    // Implement your logic to check if all parts of the message have been received
    // For example, check if a `isFinalChunk` flag is true in the last part
    return parts.some(part => part.isFinalChunk);
  }

  private assembleMessage(parts: ChatMessage[]): ChatMessage {
    // Implement your logic to combine chunks into a complete message
    // Example: concatenate the content of each part
    const combinedContent = parts.reduce((acc, part) => acc + part.content, '');
    return {...parts[0], content: combinedContent}; // Simplified
  }


  public sendMessage(chatMessage: ChatMessage): void {
    this.stompService.publish({destination: '/app/queue/chat', body: JSON.stringify(chatMessage)});
  }

  public updateUserStatus(userStatus: UserStatus): void {
    this.stompService.publish({destination: '/app/updateUserStatus', body: JSON.stringify(userStatus)});
  }

  testEndpoints() {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'DELETE, POST, GET, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    this.http.get<string>(`${this.apiUrl}/foo1`,{headers}).subscribe({
      next: data => {
        console.log(data)
      },
      error: error => {
        console.error(data)
      }
    });

    this.http.get<string>(`${this.apiUrl}/foo2`, {headers}).subscribe({
      next: data => {
        console.log(data)
      },
      error: error => {
        console.error(data)
      }
    });
  }

}
