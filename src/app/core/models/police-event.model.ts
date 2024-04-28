export interface Location {
  name: string;
  gps: string;
}

export interface PoliceEvent {
  id: number;
  datetime: string;
  name: string;
  summary: string;
  url: string;
  type: string;
  location: Location;
}

export interface Service {
  name: string;
}

export interface PoliceStation {
  id: number;
  name: string;
  Url: string;
  location: Location;
  services: Service[];
}
