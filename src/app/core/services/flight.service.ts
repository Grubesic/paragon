import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FlightData} from "../models/flight.model";

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private httpClient = inject(HttpClient)

  private flightSignal = signal<FlightData |  null>(null)
  flightData = computed(() => this.flightSignal())

  constructor() {
    this.getFlights()
  }


  private getFlights(){
    this.httpClient.get<FlightData>("http://localhost:8081/api/flights").subscribe({
      next: (data) => {
        console.log(data)
        this.flightSignal.set(data)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

}
