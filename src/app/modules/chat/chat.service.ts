import {inject, Injectable} from '@angular/core';
import {signal, computed, effect} from '@angular/core';
import {ChatMessage, UserStatus} from './chat.types';
import {RxStompService} from "../../core/ws/rx-stomp.service";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {WebSocketService} from "../../core/ws/websocket.service";
import {AuthGuardService} from "../../core/auth/authguard.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = environment.apiUrl;

  messagesInitial: ChatMessage[] = [
    {
      messageId: "1",
      senderId: "1",
      name: "System",
      content: "To create a page that resembles the ChatGPT interface with a left-hand side menu for current chats and a main window for chat input and messages, we will use Tailwind CSS for styling and Flowbite for any UI components we may include. This layout will be responsive and include a sidebar for chat sessions and a main chat area.\n" +
        "\n" +
        "First, let's outline the basic HTML structure and then apply Tailwind CSS classes for styling:",
      timestamp: new Date(),
      user: false,
    },
    {
      messageId: "2",
      senderId: "2",
      name: "admin",
      content: "typescript function that takes string and returns two first strings",
      timestamp: new Date(),
      user: true,
    },
    {
      messageId: "3",
      senderId: "3",
      name: "System",
      content: "It seems like you're trying to use Angular Material components along with Angular Router, but there's a small syntax error in your code. Specifically, the issue lies in the way you've used the [routerLink] directive. When you use property binding ([routerLink] in this case), the value should be an expression or a variable inside your component's TypeScript file. Since you're providing a string path directly, it should be enclosed in quotes within the brackets. Here's the corrected version:",
      timestamp: new Date(),
      user: false,
    },
    {
      messageId: "4",
      senderId: "4",
      name: "admin",
      content: "typescript function that takes string and returns two first strings",
      timestamp: new Date(),
      user: true,

    },

  ]

  private messages = signal<ChatMessage[]>(this.messagesInitial);
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

  private messageQueue: ChatMessage[] = [];
  private isProcessingQueue = false;

  constructor() {
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

        const chunk: ChatMessage = JSON.parse(message.body);
        this.messageQueue.push(chunk);
        if (!this.isProcessingQueue) {
          this.processQueue();
        }
      },
    });
  }

  private processQueue(): void {
    if (this.messageQueue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }

    this.isProcessingQueue = true;
    const message = this.messageQueue.shift();

    // Update your UI with the new message
    if(message != undefined)
      if(message.finalChunk){
        this.setIsLoading(false)
      } else {
        this.updateMessagesSignal(message)
      }

    setTimeout(() => {
      this.processQueue();
    }, 100); // Delay
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

  private updateMessagesSignal(incomingMessage: ChatMessage): void {
    // Use .update() method of the signal to modify the messages
    this.messages.update((currentMessages) => {
      const existingIndex = currentMessages.findIndex(m => m.messageId === incomingMessage.messageId);

      if (existingIndex !== -1) {
        // If message exists, update its content
        const updatedMessages = [...currentMessages];
        const existingMessage = updatedMessages[existingIndex];
        updatedMessages[existingIndex] = {
          ...existingMessage,
          content: existingMessage.content + incomingMessage.content
        };
        return updatedMessages;
      } else {
        // If it's a new message, add it to the array
        return [...currentMessages, incomingMessage];
      }
    });
  }

}
