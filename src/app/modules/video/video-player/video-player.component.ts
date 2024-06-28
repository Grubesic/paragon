import Player from "video.js/dist/types/player";
import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import videojs from 'video.js';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatIconModule, MatButtonModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('myVideo', { static: true }) videoElement: ElementRef<HTMLVideoElement> | undefined;
  player: Player | undefined;

  ngOnInit(): void {
    if (this.videoElement) {
      this.player = videojs(this.videoElement.nativeElement, {
        liveui: true,
        trackingThreshold: 1,
        sources: [{
          type: 'application/x-mpegURL',
          src: `${environment.apiUrl}/api/livestream-hls`
        }]
      }, () => {
        console.log('Player is ready');
        if (this.player) {
          this.player.play()
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
