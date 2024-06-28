import {computed, Injectable, NgZone, signal, WritableSignal} from '@angular/core';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SystemOverviewService {
  private dataStream: WritableSignal<string[]> = signal([]);
  monitorData = computed(() => this.dataStream())

  constructor(private zone: NgZone) {
    this.initializeSse()
  }

  initializeSse(): void {
    const eventSource = new EventSource(environment.apiUrl + '/api/scan');

    eventSource.onmessage = event => {
      this.zone.run(() => {
        // Update the signal by appending new data
        this.dataStream.update(oldData => [...oldData, event.data]);
        console.log(event.data)
      });
    };

    eventSource.onerror = error => {
      this.zone.run(() => {
        console.error('SSE error:', error);
        eventSource.close();
      });
    };
  }

}
