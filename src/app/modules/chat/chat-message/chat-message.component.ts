import {Component, inject, input, Input} from '@angular/core';
import {IMessage} from "../../../core/models/interfaces";
import {CommonModule, NgIf} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthGuardService} from "../../../core/auth/authguard.service";
import {Observable} from "rxjs";
import {ChatMessage} from "../chat.types";
import {TypewriterEffectDirective} from "../typewriter-effect.directive";
import {UtilsService} from "../../../core/services/utils.service";


@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    TypewriterEffectDirective
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {

  @Input() messageModel: ChatMessage | undefined;
  authService: AuthGuardService = inject(AuthGuardService);
  utilService: UtilsService = inject(UtilsService);


  constructor(private _snackBar: MatSnackBar) {
  }


  copyText(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this._snackBar.open('Text copied to clipboard', '', {
        duration: 3000
      });
    }).catch((err: any) => {
      console.error('Failed to copy text: ', err);
    });
  }

}
