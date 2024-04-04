import { Timestamp } from "geolib/es/types";
import { Schema, Document, model } from "mongoose";

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface DeviceSchema {
  fcm_token: string;
  locations: Location[];
}

export type DeviceDocument = Document & DeviceSchema;

interface User {
  username: string;
  password: string;
  devices: DeviceSchema[];
}

const locationSchema = new Schema<Location>({
  latitude: { type: Number },
  longitude: { type: Number },
  timestamp: { type: Number },
});

const deviceSchema = new Schema<DeviceSchema>({
  fcm_token: { type: String, unique: true },
  locations: [{ type: locationSchema, default: [] }],
});

const userSchema = new Schema<User>({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  devices: [{ type: Schema.Types.ObjectId, ref: "Device" }],
});

export const User = model<User>("User", userSchema);
export const DeviceModel = model<DeviceSchema>("Device", deviceSchema);
export const Location = model<Location>("Location", locationSchema);
