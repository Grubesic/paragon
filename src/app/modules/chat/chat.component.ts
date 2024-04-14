import {AfterViewInit, Component, computed, effect, ElementRef, inject, ViewChild} from '@angular/core';
import {ChatMessageComponent} from "./chat-message/chat-message.component";
import {IMessage} from "../../core/models/interfaces";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgScrollbar, NgScrollbarModule} from 'ngx-scrollbar';
import {AuthGuardService} from "../../core/auth/authguard.service";
import {ChatService} from "./chat.service";
import {ChatMessage} from "./chat.types";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ChatMessageComponent,
    NgForOf,
    NgIf,
    FormsModule,
    NgScrollbarModule

  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements AfterViewInit {
  userInput = '';

  @ViewChild(NgScrollbar) scrollbar: NgScrollbar | undefined;
  authService: AuthGuardService = inject(AuthGuardService);
  private chatService: ChatService = inject(ChatService);

  isLoadingMessages = computed(() => this.chatService.isLoading())

  constructor() {
    this.reactToMessageChange()
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }



  sendMessage() {
    this.chatService.setIsLoading(true)
    if (!this.userInput.trim()) return;
    let message = {
      messageId: "",
      senderId: this.authService.user()?.id!,
      name: this.authService.user()?.username!,
      content: this.userInput,
      timestamp: new Date(),
      user: true
    }

    this.chatService.addMessages(message)
    this.chatService.sendMessage(message)
    this.scrollToBottom()
    this.userInput = ''

  }

  scrollToBottom(): void {

    setTimeout(() => {
      try {
        if (this.scrollbar) {
          this.scrollbar.scrollTo({
            bottom: 0,
            duration: 300
          });
        }
      } catch (err) {
      }
    }, 0);


  }

  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  getMessages() {
    return this.chatService.allMessages()
  }

  private reactToMessageChange() {
    effect(() => {
        this.chatService.allMessages() // listen for changes in messages
        console.log("reactToMessageChange")
        this.scrollToBottom()
      }
    )
  }

  getInputPlaceholder(){
    if(this.isLoadingMessages()){
     return "Skriver.."
    }else {
      return "Fråga Advokado"
    }
  }

}
