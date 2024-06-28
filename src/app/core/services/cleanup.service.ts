import {HostListener, Inject, Injectable} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class CleanupService {
  private apiUrl = 'https://yourdomain.com'; // Replace with your API URL

  constructor( private dialog: MatDialog, @Inject(DOCUMENT) private document: Document) {
    this.addVisibilityChangeListener();
    this.addPageHideListener();
    this.addBeforeUnloadListener();
  }

  private addVisibilityChangeListener() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  private addPageHideListener() {
    window.addEventListener('pagehide', this.handlePageHide.bind(this));
  }

  private addBeforeUnloadListener() {
    window.addEventListener('beforeunload', this.beforeUnloadHandler.bind(this));
  }

  private handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      this.cleanup();
    }
  }

  private handlePageHide(event: PageTransitionEvent) {
    this.cleanup();
  }

  private cleanup() {
    console.log('Performing cleanup tasks...');
    //this.disconnectReader();
  }

  private beforeUnloadHandler(event: BeforeUnloadEvent) {
    // Show the default confirmation dialog
    event.preventDefault();
    event.returnValue = '';

    // Perform the cleanup task
    this.cleanup();
  }
}
