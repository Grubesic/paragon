import {computed, inject, Injectable, signal} from '@angular/core';
import {IPAddress} from "../models/interfaces";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class IpService {

  private http = inject(HttpClient)


  private ipSignal = signal<IPAddress>({ip: "Unknown"})
  ip = computed(() => this.ipSignal())

  constructor() { this.getIPAddress()}

  private getIPAddress(){
    this.http.get<IPAddress>(environment.apiUrl + "/api/ip").subscribe({
      next: (data) => {this.ipSignal.set(data)},
      error: (error) => {console.log(error)}
    })
  }

}
