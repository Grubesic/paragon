import {Component, inject} from '@angular/core';
import {WeatherService} from "./weather.service";

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent{
  weatherService = inject(WeatherService)



}
