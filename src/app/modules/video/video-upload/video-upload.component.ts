import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VideoService} from "../video.service";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FormsModule],
  templateUrl: './video-upload.component.html',
  styleUrl: './video-upload.component.scss'
})
export class VideoUploadComponent {
  file: File | null = null;
  videoName: string = '';

  constructor(private videoService: VideoService) {}

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  uploadVideo() {
    if (this.file && this.videoName) {
      this.videoService.uploadVideo(this.file, this.videoName).subscribe(response => {
        console.log(response);
      });
    }
  }
}
