import {inject, Injectable} from '@angular/core';
import {signal, computed, effect} from '@angular/core';
import {ChatMessage, UserStatus} from './chat.types';
import {RxStompService} from "../../core/ws/rx-stomp.service";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {WebSocketService} from "../../core/ws/websocket.service";
import {AuthGuardService} from "../../core/auth/authguard.service";

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:8081/api';

  private messages = signal<ChatMessage[]>([]);
  private messagesLoading = signal<boolean>(false);

  private userStatus = signal<UserStatus | null>(null);
  private messageChunks = signal<{ [messageId: string]: ChatMessage[] }>({});

  private stompService: RxStompService = inject(RxStompService);
  private authService: AuthGuardService = inject(AuthGuardService)

  allMessages = computed(() => this.messages());
  user = computed(() => this.userStatus());
  isLoading = computed(() => this.messagesLoading());

  private http: HttpClient = inject(HttpClient);
  private webocketService: WebSocketService = inject(WebSocketService)

  constructor() {
    // this.testEndpoints()
    this.webocketService.activateWebSocket().subscribe({
      next: data => {
        console.log(data)
        this.initializeSubscriptions()
      }
    })

  }

  private initializeSubscriptions(): void {
    this.stompService.watch(`/user/queue/message`).subscribe({
      next: (message) => {
        console.log(message)
        const chunk: ChatMessage = JSON.parse(message.body);
        this.addMessages(chunk)
        this.setIsLoading(false)
        //this.handleMessageChunk(chunk);
      },
    });

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
    this.http.get<any>(`${this.apiUrl}/user`).subscribe({
      next: data => {
        console.log(data)
      },
      error: error => {
        console.error(error)
      }
    });

    this.http.get<any>(`${this.apiUrl}/admin`).subscribe({
      next: data => {
        console.log(data)
      },
      error: error => {
        console.error(error)
      }
    });
  }

  addMessages(message: ChatMessage){
    this.messages.update((currentMessages) => {
      return [...currentMessages, message]
    })
  }

  setIsLoading(isLoading: boolean){
    this.messagesLoading.set(isLoading);
  }

}
