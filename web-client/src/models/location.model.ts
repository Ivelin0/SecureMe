export interface Location {
  event?: "location";
  latittude: number;
  longitude: number;
  full_brand: String;
}

export interface Point {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface DeviceCurrentLocation {
  [fcm_token: string]: Location
}