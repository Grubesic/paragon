import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiUrl = 'http://localhost:8081/video'; // Update with actual API URL

  constructor(private http: HttpClient) {}

  uploadVideo(file: File, name: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    return this.http.post(`${this.apiUrl}`, formData, { responseType: 'text' });
  }

  getAllVideos() {
    return this.http.get<string[]>(`${this.apiUrl}/all`);
  }

  getVideo(name: string) {
    return this.http.get(`${this.apiUrl}/${name}`, { responseType: 'blob' });
  }
}
