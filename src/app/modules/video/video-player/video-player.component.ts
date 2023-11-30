import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {VideoService} from "../video.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatIconModule, MatButtonModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnInit{
  videoName: string = '';
  videoUrl: SafeUrl | null = null;
  loading: boolean = true;

  constructor(private videoService: VideoService, private sanitizer: DomSanitizer, private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const name = params['name'];
      this.videoName = name;
      this.videoService.getVideo(name).subscribe(blob => {
        const objectURL = URL.createObjectURL(blob);
        this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      });
    });
  }

  goBack() {
    this.router.navigate(['/video-list']);
  }

  onVideoLoad() {
    this.loading = false;
  }

  ngOnChanges() {
    if (this.videoName) {
      this.videoService.getVideo(this.videoName).subscribe(blob => {
        const objectURL = URL.createObjectURL(blob);
        this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      });
    }
  }
}
