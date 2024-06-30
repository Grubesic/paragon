import {inject, Injectable, NgZone} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {HttpClient, HttpEventType} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PassportService {

  apiUrl = 'http://localhost:8080';

  constructor(private zone: NgZone) { }

  startReadingPassportData(): Observable<string> {
    return new Observable<string>(observer => {
      const eventSource = new EventSource('http://localhost:8080/api/connect');

      eventSource.onmessage = (event) => {
        this.zone.run(() => {
          observer.next(event.data);
        });
      };

      eventSource.addEventListener('PASSPORT_DATA', (event: any) => {
        this.zone.run(() => {
          observer.next(event.data);
        });
      });

      eventSource.addEventListener('CONNECTED', (event: any) => {
        this.zone.run(() => {
          observer.next(event.data);
        });
      });

      eventSource.addEventListener('DISCONNECTED', (event: any) => {
        this.zone.run(() => {
          observer.complete();
        });
        eventSource.close();
      });

      eventSource.onerror = (error) => {
        this.zone.run(() => {
          observer.error('An error occurred: ' + error);
        });
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    });
  }
}


