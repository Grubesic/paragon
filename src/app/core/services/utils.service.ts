import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

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
}
