import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {PoliceEvent} from "../models/police-event.model";
import {er} from "@fullcalendar/core/internal-common";

@Injectable({
  providedIn: 'root'
})
export class PoliceService {

  private eventSignal = signal<PointerEvent[]>([])
  policeEvents = computed(() => this.eventSignal)

  http = inject(HttpClient)

  constructor() { this.getEvents()}

  getEvents(){
    this.http.get<PoliceEvent[]>(environment.apiUrl + "/api/events").subscribe({
      next: data => {
        console.log(data)
      },
      error: err => {console.log(err)}
    })

  }
}
