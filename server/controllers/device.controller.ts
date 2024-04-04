import { Request, Response } from "express";

import { ws_smart_client } from "../server";
import * as geolib from "geolib";
import fs from "fs";
import path from "path";
import { addToken, getTokens, Device } from "../utility/redis/redis.operations";
import "dotenv/config";
import { fcmNotify } from "../utility/helper";

import { STATUSES, Callback } from "../models/resources/callback.model";
import { StatusCodes } from "http-status-codes";
import {
  User,
  Location,
  DeviceModel,
  DeviceSchema,
  DeviceDocument,
} from "../schemas/user.schema";

export const locationHandler = async ({
  method,
  userId,
  originalUrl,
}: any): Promise<Callback> => {
  const tokens = (await getTokens(userId)).filter((token) => token != null);

  if (tokens.length === 0)
    return {
      type: STATUSES.ERROR,
      status: StatusCodes.SERVICE_UNAVAILABLE,
      message: "There are no attached devices to this account",
    };
  return await fcmNotify({ method, originalUrl }, userId);
};

const device_locations = async (req: any, res: Response) => {
  let result: Callback = await locationHandler({
    method: req.method,
    userId: req.userId,
    originalUrl: req.originalUrl,
  });
  res.status(result.status).send({ message: result.message });
};

const incorrect_password = async (req: Request, res: Response) => {
  res.status(200).send({ message: "okay", file_path: req.file?.destination });
};

const retrieveImages = (req: any, res: any) => {
  const directoryPath = path.join(
    __dirname,
    "..",
    "images",
    req.params.fcm_token
  );

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to scan directory" });
    }

    const imageFiles = files.filter(
      (file) => file.endsWith(".jpg") || file.endsWith(".png")
    );

    res.json({ images: imageFiles });
  });
};

const track_location = async (req: any, res: Response) => {
  const { fcm_token, latitude, longitude } = req.body;

  const device = (await getTokens(req.userId)).filter(
    (token) => token.fcm_token == fcm_token
  )[0];

  if (device?.last_location) {
    const metersDiff = geolib.getDistance(
      { latitude, longitude },
      device.last_location
    );

    if (metersDiff >= Number(process.env.LOCATION_DIFFERENCE_ON_SAVE)) {
      const user = await User.findOne({ username: req.userId });
      const location = new Location({
        latitude: latitude,
        longitude: longitude,
        timestamp: Date.now(),
      });
      await location.save();
      const give: DeviceDocument | null = await DeviceModel.findOne({
        fcm_token: fcm_token,
      });

      give?.locations!.push(location);
      give?.save();

      addToken(req.userId, {
        fcm_token,
        last_location: { latitude, longitude },
      } as Device);

      user?.save();
    }
  } else
    addToken(req.userId, {
      fcm_token,
      last_location: { latitude, longitude },
    } as Device);

  res.json({ message: "okay" });
};

const location_history = async (req: any, res: Response) => {
  const { startDate, endDate, fcm } = req.body;

  const device: DeviceSchema | null = await DeviceModel.findOne({
    fcm_token: fcm,
  });
  if (!device?.locations) return;
  const { locations } = device;
  let start = 0,
    end = 0;

  // temporary O(N) solution for finding all dots inrange ; refactor this with BS log(N)
  let isFirst = true;
  for (let i = 0; i < locations.length; i++) {
    let currDate = locations[i].timestamp;
    if (currDate >= startDate && currDate <= endDate) {
      if (isFirst) {
        start = i;
        isFirst = false;
      }
      end = i;
    }
  }

  if (isFirst) res.json({ locations: [] });
  else res.json({ locations: locations.splice(start, end + 1) });
};
const boot = (req: Request, res: Response) => {
  const { brand } = req.body;

  ws_smart_client.clients.forEach(function each(client: any) {
    if (client.id !== brand)
      client.send(JSON.stringify({ event: "boot", message: brand }));
  });

  res.json({ message: "okay" });
};

export default {
  incorrect_password,
  location_history,
  track_location,
  retrieveImages,
  device_locations,
  boot,
};
