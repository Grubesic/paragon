export interface FlightData {
  time: number;
  states: StateVector[];
}

export type StateVector = [
  icao24: string,
  callsign: string | null,
  originCountry: string,
  timePosition: number | null,
  lastContact: number,
  longitude: number | null,
  latitude: number | null,
  baroAltitude: number | null,
  onGround: boolean,
  velocity: number | null,
  trueTrack: number | null,
  verticalRate: number | null,
  sensors: number[] | null,
  geoAltitude: number | null,
  squawk: string | null,
  spi: boolean,
  positionSource: number,
  category?: number // Added as optional since it's not in the provided example but mentioned in the API description
];

/**
 *
 * Property
 *
 * Type
 *
 * Description
 *
 * lamin
 *
 * float
 *
 * lower bound for the latitude in decimal degrees
 *
 * lomin
 *
 * float
 *
 * lower bound for the longitude in decimal degrees
 *
 * lamax
 *
 * float
 *
 * upper bound for the latitude in decimal degrees
 *
 * lomax
 *
 * float
 *
 * upper bound for the longitude in decimal degrees
 *
 * Lastly, you can request the category of aircraft by adding the following request parameter:
 *
 * Property
 *
 * Type
 *
 * Description
 *
 * extended
 *
 * integer
 *
 * Set to 1 if required
 *
 * Example query with time and aircraft: https://opensky-network.org/api/states/all?time=1458564121&icao24=3c6444
 *
 * Example query with bounding box covering Switzerland: https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.5226
 *
 * Response¶
 * The response is a JSON object with the following properties
 *
 * Property
 *
 * Type
 *
 * Description
 *
 * time
 *
 * integer
 *
 * The time which the state vectors in this response are associated with. All vectors represent the state of a vehicle with the interval
 * .
 *
 * states
 *
 * array
 *
 * The state vectors.
 *
 * The states property is a two-dimensional array. Each row represents a state vector and contains the following fields:
 *
 * Index
 *
 * Property
 *
 * Type
 *
 * Description
 *
 * 0
 *
 * icao24
 *
 * string
 *
 * Unique ICAO 24-bit address of the transponder in hex string representation.
 *
 * 1
 *
 * callsign
 *
 * string
 *
 * Callsign of the vehicle (8 chars). Can be null if no callsign has been received.
 *
 * 2
 *
 * origin_country
 *
 * string
 *
 * Country name inferred from the ICAO 24-bit address.
 *
 * 3
 *
 * time_position
 *
 * int
 *
 * Unix timestamp (seconds) for the last position update. Can be null if no position report was received by OpenSky within the past 15s.
 *
 * 4
 *
 * last_contact
 *
 * int
 *
 * Unix timestamp (seconds) for the last update in general. This field is updated for any new, valid message received from the transponder.
 *
 * 5
 *
 * longitude
 *
 * float
 *
 * WGS-84 longitude in decimal degrees. Can be null.
 *
 * 6
 *
 * latitude
 *
 * float
 *
 * WGS-84 latitude in decimal degrees. Can be null.
 *
 * 7
 *
 * baro_altitude
 *
 * float
 *
 * Barometric altitude in meters. Can be null.
 *
 * 8
 *
 * on_ground
 *
 * boolean
 *
 * Boolean value which indicates if the position was retrieved from a surface position report.
 *
 * 9
 *
 * velocity
 *
 * float
 *
 * Velocity over ground in m/s. Can be null.
 *
 * 10
 *
 * true_track
 *
 * float
 *
 * True track in decimal degrees clockwise from north (north=0°). Can be null.
 *
 * 11
 *
 * vertical_rate
 *
 * float
 *
 * Vertical rate in m/s. A positive value indicates that the airplane is climbing, a negative value indicates that it descends. Can be null.
 *
 * 12
 *
 * sensors
 *
 * int[]
 *
 * IDs of the receivers which contributed to this state vector. Is null if no filtering for sensor was used in the request.
 *
 * 13
 *
 * geo_altitude
 *
 * float
 *
 * Geometric altitude in meters. Can be null.
 *
 * 14
 *
 * squawk
 *
 * string
 *
 * The transponder code aka Squawk. Can be null.
 *
 * 15
 *
 * spi
 *
 * boolean
 *
 * Whether flight status indicates special purpose indicator.
 *
 * 16
 *
 * position_source
 *
 * int
 *
 * Origin of this state’s position.
 *
 * 0 = ADS-B
 *
 * 1 = ASTERIX
 *
 * 2 = MLAT
 *
 * 3 = FLARM
 *
 * 17
 *
 * category
 *
 * int
 *
 * Aircraft category.
 *
 * 0 = No information at all
 *
 * 1 = No ADS-B Emitter Category Information
 *
 * 2 = Light (< 15500 lbs)
 *
 * 3 = Small (15500 to 75000 lbs)
 *
 * 4 = Large (75000 to 300000 lbs)
 *
 * 5 = High Vortex Large (aircraft such as B-757)
 *
 * 6 = Heavy (> 300000 lbs)
 *
 * 7 = High Performance (> 5g acceleration and 400 kts)
 *
 * 8 = Rotorcraft
 *
 * 9 = Glider / sailplane
 *
 * 10 = Lighter-than-air
 *
 * 11 = Parachutist / Skydiver
 *
 * 12 = Ultralight / hang-glider / paraglider
 *
 * 13 = Reserved
 *
 * 14 = Unmanned Aerial Vehicle
 *
 * 15 = Space / Trans-atmospheric vehicle
 *
 * 16 = Surface Vehicle – Emergency Vehicle
 *
 * 17 = Surface Vehicle – Service Vehicle
 *
 * 18 = Point Obstacle (includes tethered balloons)
 *
 * 19 = Cluster Obstacle
 *
 * 20 = Line Obstacle
 *
 *
 *
 *
 *
 * **/
