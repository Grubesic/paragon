import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ImageData, ImageSettings} from "../model/models";

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {
  private apiUrl = 'http://127.0.0.1:8888/v1/generation/text-to-image';
  constructor(private http: HttpClient) { }

  generateImage(imageSettings: ImageSettings) {
    return this.http.post<ImageData[]>(`${this.apiUrl}`, imageSettings);
  }

}
