import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {VideoPlayerComponent} from "../video/video-player/video-player.component";
import {CleanupService} from "../../core/services/cleanup.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, VideoPlayerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
cleanupService = inject(CleanupService);

}
