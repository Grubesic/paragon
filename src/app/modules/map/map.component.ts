import {Component, effect, inject, Injector, OnInit, runInInjectionContext} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import {environment} from "../../../environments/environment";
import {WeatherService} from "../weather/weather.service";
import { FeatureCollection, Geometry } from 'geojson';
import {FlightService} from "../../core/services/flight.service";
import {StateVector} from "../../core/models/flight.model";
import {PoliceService} from "../../core/services/police.service";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {

  weatherService = inject(WeatherService)
  flightService = inject(FlightService)
  policeService = inject(PoliceService)

  constructor(private injector: Injector) {
    this.handleMultipoint()
    console.log(this.policeService.policeEvents)
  }


  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/grubesic/clupw58w900r001qq4yvfgsry';
  lat: number = 59.382997;
  lng: number = 17.897272;
  //59.382997, 17.897272
  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 10, //16
      pitch: 45,
      bearing: -17.6,
      center: [this.lng, this.lat]

    });

    this.map.addControl(new mapboxgl.NavigationControl());

    if(this.map){
      this.map.on('style.load', () => {
        // Insert the layer beneath any symbol layer.
        // @ts-ignore
        const layers = this.map.getStyle().layers;
        // @ts-ignore
        const labelLayerId = layers.find(
          (layer) => layer.type === 'symbol' && layer.layout!['text-field']
        ).id;

        // The 'building' layer in the Mapbox Streets
        // vector tileset contains building height data
        // from OpenStreetMap.
        // @ts-ignore
        this.map.addLayer(
          {
            'id': 'add-3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': '#aaa',

              // Use an 'interpolate' expression to
              // add a smooth transition effect to
              // the buildings as the user zooms in.
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          },
          labelLayerId
        );
      });

      this.map.on('load', () => {
        // Adding the polygon layer to the map
        this.map!.addSource('polygon', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              // Use your PolygonData's coordinates here
              coordinates: this.weatherService.polygon().coordinates
            }
          }
        });


        this.map!.addLayer({
          id: 'polygon',
          type: 'line',
          source: 'polygon',
          layout: {},
          paint: {
            'line-color': '#880000',
            'line-opacity': 0.8
          }
        });
      });

      this.map.on('load', () => {
        this.map!.loadImage(
          // Add your icon image URL here
          '/assets/icons/plane.png',
          (error, image) => {
            if (error) throw error;
            console.log(image)
            this.map!.addImage('plane', image!);

            runInInjectionContext(this.injector,() => {
              this.handleFlightData()
            });
          }
        );
      });

    }
  }

  private handleMultipoint(){
    effect(() =>{
      if(this.weatherService.multiPointData() != null && this.weatherService.multiPointCoordinates().coordinates.length > 0){
        this.addPrecipitation()
      }

    })
  }

  private handleFlightData() {
    effect(() => {
      console.log("handle flight called")
      const flightData = this.flightService.flightData();
      if (flightData && flightData.states.length > 0) {
        this.addFlightMarkers(flightData.states);
      }
    });
  }

  private addPrecipitation(){
     let geojsonData: FeatureCollection<Geometry> = {
      type: 'FeatureCollection',
      features: this.weatherService.multiPointCoordinates().coordinates.map((coord, index) => ({
        type: 'Feature',
        properties: {
          // Use 'value' as the property to store your data value
          value: this.weatherService.multiPointData()?.timeSeries[0].parameters[0].values[index],
        },
        geometry: {
          type: 'Point',
          coordinates: coord,
        },
      })),
    };

    console.log(geojsonData)
    this.map!.addSource('precipitation', {
      type: 'geojson',
      data: geojsonData, // The GeoJSON data prepared earlier
    });

    // Add a heatmap layer using the data source
    this.map!.addLayer({
      id: 'precipitation-heatmap',
      type: 'heatmap',
      source: 'precipitation',
      maxzoom: 15, // Adjust as needed
      paint: {
        // Increase the heatmap weight based on the 'value' property
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'value'],
          0, 0, // No precipitation
          6, 1, // Maximum precipitation category
        ],
        // Use colors to represent different intensities
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0,0,255,0)',
          0.1, 'blue',
          0.3, 'cyan',
          0.5, 'lime',
          0.7, 'yellow',
          1, 'red',
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          9, 20,
        ],
        // Adjust the heatmap intensity by zoom level
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          9, 3,
        ],
      },
    });
  }


  private addFlightMarkers(flightStates: any[]) {
    const geojsonData: FeatureCollection<Geometry> = {
      type: 'FeatureCollection',
      features: flightStates.map((state) => ({
        type: 'Feature',
        properties: {
          icao24: state[0],
          callsign: state[1].trim(),
          originCountry: state[2],
          velocity: state[9],
          trueTrack: state[10],
        },
        geometry: {
          type: 'Point',
          coordinates: [state[5], state[6]], // longitude, latitude
        },
      })),
    };

    console.log(geojsonData);
    this.map!.addSource('flights', {
      type: 'geojson',
      data: geojsonData, // The GeoJSON data prepared earlier
    });

    this.map!.addLayer({
      id: 'flights',
      type: 'symbol',
      source: 'flights',
      layout: {
        'icon-image': 'plane', // Use an appropriate icon here
        'icon-size': 0.1,
        'text-field': ['get', 'callsign'], // Display the callsign as label
        'text-offset': [0, 1.5],
        'text-anchor': 'top',
        'icon-allow-overlap': true,
        'text-allow-overlap': true
      },
      paint: {
        // Define any paint properties you need
      },
    });
  }

}
