import {AfterViewInit, Component, ElementRef, inject, ViewChild} from '@angular/core';
import {ChatMessageComponent} from "./chat-message/chat-message.component";
import {IMessage} from "../../core/models/interfaces";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgScrollbar, NgScrollbarModule} from 'ngx-scrollbar';
import {AuthGuardService} from "../../core/auth/authguard.service";
import {ChatService} from "./chat.service";

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
export class ChatComponent implements AfterViewInit{
  userInput = '';

  @ViewChild(NgScrollbar) scrollbar: NgScrollbar | undefined;
  authService: AuthGuardService = inject(AuthGuardService);
  private chatService: ChatService = inject(ChatService);

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  messages: IMessage[] = [
    {
      id: 1,
      message: "To create a page that resembles the ChatGPT interface with a left-hand side menu for current chats and a main window for chat input and messages, we will use Tailwind CSS for styling and Flowbite for any UI components we may include. This layout will be responsive and include a sidebar for chat sessions and a main chat area.\n" +
        "\n" +
        "First, let's outline the basic HTML structure and then apply Tailwind CSS classes for styling:",
      timestamp: "11:36",
      isUser: false,
      name: "Advokado"
    },
    {
      id: 2,
      message: "typescript function that takes string and returns two first strings",
      timestamp: "11:40",
      isUser: true,
      name: "Robert"
    },
    {
      id: 3,
      message: "It seems like you're trying to use Angular Material components along with Angular Router, but there's a small syntax error in your code. Specifically, the issue lies in the way you've used the [routerLink] directive. When you use property binding ([routerLink] in this case), the value should be an expression or a variable inside your component's TypeScript file. Since you're providing a string path directly, it should be enclosed in quotes within the brackets. Here's the corrected version:",
      timestamp: "11:41",
      isUser: false,
      name: "Advokado"
    },
    {
      id: 4,
      message: "typescript function that takes string and returns two first strings",
      timestamp: "11:42",
      isUser: true,
      name: "Robert"
    },


  ]


  sendMessage() {
    if (!this.userInput.trim()) return;
    this.messages.push({
      id: 1,
      message: this.userInput,
      timestamp: this.getCurrentTime(),
      isUser: true,
      name: this.authService.user()?.username!
    },)
    this.userInput = ''
    this.scrollToBottom()
    this.chatService.sendMessage({
      messageId: "1",
      senderId: this.authService.user()?.id!,
      content: this.userInput,
      timestamp: new Date(),
    })

  }

  scrollToBottom(): void {

    setTimeout(() => {
      try {
        if(this.scrollbar){
          this.scrollbar.scrollTo({
            bottom: 0,
            duration: 300
          });
        }
      } catch (err) { }
    }, 0);



  }

 getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
