import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  getChat(){
    new TextDecoderStream().readable.getReader()
  }
}
