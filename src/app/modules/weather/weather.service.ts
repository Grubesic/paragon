import {computed, inject, Injectable, signal, Signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MultiPoint, PolygonData, WeatherData} from "./weather.model"
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  http = inject(HttpClient)

  private weatherSignal = signal<WeatherData | null>(null)
  weatherData = computed(() => this.weatherSignal())

  private multiPointSignal = signal<WeatherData | null>(null)
  multiPointData = computed(() => this.multiPointSignal())

  private polygonSignal = signal<PolygonData>({type: "Polygon", coordinates: []})
  polygon = computed(() => this.polygonSignal())

  private multiPointCoordinatesSignal = signal<MultiPoint>({type: "MultiPoint", coordinates: []})
  multiPointCoordinates = computed(() => this.multiPointCoordinatesSignal())

  constructor() {
    this.getWeatherData()
    this.getPolygon()
    this.getMultipoint()
    this.getMultipointCoordinates()
  }

  private getWeatherData() {
    this.http.get<WeatherData>(environment.apiUrl + "/api/weather").subscribe({
      next: (data) => {console.log(data)},
      error: (error) => {console.log(error)}
    })

  }

  private getPolygon() {
    this.http.get<PolygonData>(environment.apiUrl + "/api/polygon").subscribe({
      next: (data) => {console.log(data); this.polygonSignal.set(data)},
      error: (error) => {console.log(error)}
    })
  }

  private getMultipoint() {
    this.http.get<WeatherData>(environment.apiUrl + "/api/multipoint").subscribe({
      next: (data) => {console.log(data); this.multiPointSignal.set(data)},
      error: (error) => {console.log(error)}
    })
  }

  private getMultipointCoordinates() {
    this.http.get<MultiPoint>(environment.apiUrl + "/api/multipoint-coordinates").subscribe({
      next: (data) => {console.log(data); this.multiPointCoordinatesSignal.set(data)},
      error: (error) => {console.log(error)}
    })
  }
}
