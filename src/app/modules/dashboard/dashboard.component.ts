import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VideoPlayerComponent} from "../video/video-player/video-player.component";
import {CleanupService} from "../../core/services/cleanup.service";
import {PassportService} from "../../core/services/passport.service";
import {Subscription, SubscriptionLike} from "rxjs";
import {EventSourceService} from "../../core/services/event-source.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, VideoPlayerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements  OnDestroy, OnInit{

  cleanupService = inject(CleanupService);

  passportService = inject(PassportService);

  private passportDataSubscription: Subscription | null = null;
  passportData: string[] = [];
  errorMessage: string | null = null;
  loading: boolean = false;

  ngOnInit(): void {
    this.startReadingPassportData();
  }

  startReadingPassportData(){
    this.loading = true;
    this.passportDataSubscription = this.passportService.startReadingPassportData()
      .subscribe({
        next: data => {
          this.passportData.push(data);
          this.loading = false;
        },
        error: error => {
          this.errorMessage = error;
          this.loading = false;
          this.startReadingPassportData();
        },
        complete: () => {
          console.log('Connection closed');
          this.startReadingPassportData();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.passportDataSubscription) {
      this.passportDataSubscription.unsubscribe();
    }
  }
}
