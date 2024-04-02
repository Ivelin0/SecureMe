import { Schema, model } from "mongoose";

interface Location {
  latitude: number;
  longitude: number;
}

export interface DeviceModel {
  fcm_token: string;
  locations?: Location[];
}

interface User {
  username: string;
  password: string;
  devices: DeviceModel[]
}

const locationSchema = new Schema<Location>({
  latitude: {type: Number},
  longitude: {type: Number}
})

const deviceSchema = new Schema<DeviceModel>({
  fcm_token: {type: String},
  locations: { type: [locationSchema], default: []}
})


const userSchema = new Schema<User>({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  devices: [deviceSchema]
});



export const User = model<User>("User", userSchema);
export const Device = model<DeviceModel>("Device", deviceSchema);
export const Location = model<Location>("Location", locationSchema);
