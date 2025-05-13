export interface Location {
  event?: "location";
  latitude: number;
  longitude: number;
  full_brand: String;
}

export interface Point {
  latitude: number;
  longitude: number;
  timestamp?: number;
  idx?: number;
}

export interface DeviceCurrentLocation {
  [fcm_token: string]: Location;
}
