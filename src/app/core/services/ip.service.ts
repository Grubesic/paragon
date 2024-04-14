import {computed, inject, Injectable, signal} from '@angular/core';
import {IPAddress} from "../models/interfaces";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class IpService {

  private http = inject(HttpClient)

  private ipSignal = signal<IPAddress>({ip: "Unknown"})
  ip = computed(() => this.ipSignal())

  constructor() { this.getIPAddress()}

  private getIPAddress(){
    this.http.get<IPAddress>("http://localhost:8081/api/ip").subscribe({
      next: (data) => {this.ipSignal.set(data)},
      error: (error) => {console.log(error)}
    })
  }

}
