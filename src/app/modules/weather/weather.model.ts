export interface WeatherData {
  approvedTime: string;
  referenceTime: string;
  geometry: Geometry;
  timeSeries: TimeSeries[];
}

export interface Geometry {
  type: string;
  coordinates: number[][][];
}

export interface TimeSeries {
  validTime: string;
  parameters: Parameter[];
}

export interface Parameter {
  name: string;
  levelType: string;
  level: number;
  unit: string;
  values: number[];
}

export interface PolygonData {
  type: string;
  coordinates: number[][][];
}

export interface MultiPoint {
  type: string;
  coordinates: number[][];
}
