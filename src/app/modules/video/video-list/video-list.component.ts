import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VideoService} from "../video.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss'
})
export class VideoListComponent {
  videos: string[] = [];

  constructor(private videoService: VideoService, private router: Router) {}

  ngOnInit() {
    this.videoService.getAllVideos().subscribe(videoNames => {
      this.videos = videoNames;
    });
  }

  selectVideo(name: string) {
    this.router.navigate(['/video', name]);
  }


}
