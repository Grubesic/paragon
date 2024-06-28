import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {WebSocketService} from "../../core/ws/websocket.service";
import {ChatMessage} from "../chat/chat.types";
import {RxStompService} from "../../core/ws/rx-stomp.service";

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiUrl = 'http://localhost:8081/video';
  private http: HttpClient = inject(HttpClient)
  private webSocketService: WebSocketService = inject(WebSocketService)
  private stompService: RxStompService = inject(RxStompService)

  constructor() {

    this.webSocketService.activateWebSocket().subscribe({
      next: data => {
        if(data)
        this.initializeSubscriptions()
      }
    })
  }

  private initializeSubscriptions(): void {
    this.stompService.watch(`/topic/video-frame`).subscribe({
      next: (message) => {
        console.log(message)
      },
    });
  }


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

  getVideoUrl(name: string): string {
    return this.apiUrl+ '/' + name;
  }
}
