import {Component, input, Input} from '@angular/core';
import {IMessage} from "../../../core/models/interfaces";
import {NgIf} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {

  @Input() messageModel: IMessage | undefined;


  constructor(private _snackBar: MatSnackBar) {}

  getFirstTwoChars(input: string | undefined): string {
    if(input != undefined){
      if (input.length >= 2) {
        return input.substring(0, 2).toUpperCase();
      } else {
        // If the input is less than 2 characters long, return the original string
        return input;
      }
    }
    return ""
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
