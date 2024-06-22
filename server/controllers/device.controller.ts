import "dotenv/config";
import "multer";

import * as geolib from "geolib";

import { Callback, STATUSES } from "../models/resources/callback.model";
import {
  Device,
  addMobileData,
  getMobileData,
} from "../utility/redis/redis.operations";
import {
  DeviceDocument,
  DeviceModel,
  DeviceSchema,
  Location,
  User,
} from "../schemas/user.schema";
import { Request, Response } from "express";
import {
  validateAuthMobileRequest,
  validateAuthRequest,
} from "../utility/validation";

import MESSAGES from "../log_messages/messages.json";
import { StatusCodes } from "http-status-codes";
import { mobileNotify } from "../utility/helper";
import fs from "fs";
import path from "path";
import { UserDevices } from "../schemas/user.schema";

export const locationHandler = async ({
  method,
  userId,
  originalUrl,
}: {
  method: string;
  originalUrl: string;
  userId: string;
}): Promise<Callback> => {
  const tokens = (await getMobileData(userId)).filter((token) => token != null);
  if (tokens.length === 0)
    return {
      type: STATUSES.ERROR,
      status: StatusCodes.SERVICE_UNAVAILABLE,
      message: "There are no attached devices to this account",
    };
  return await mobileNotify({ method, originalUrl }, userId);
};

const startDeviceLocation = async (req: Request, res: Response) => {
  if (!validateAuthRequest(req)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: MESSAGES.INCORRECT_WEB_AUTH_REQUEST });
    return;
  }
  let result: Callback = await locationHandler({
    method: req.method,
    userId: req.authData.userId,
    originalUrl: req.originalUrl,
  });
  res.status(result.status).send({ message: result.message });
};

const incorrectPassword = async (req: Request, res: Response) => {
  if (!validateAuthRequest(req)) {
    res.status(StatusCodes.BAD_REQUEST).send({ message: "The request" });
    return;
  }
  const { brand } = req.body;
  await mobileNotify(
    { method: "POST", originalUrl: "/camera", brand },
    req.authData.userId
  );

  res.status(200).send({ message: "okay", file_path: req.file?.destination });
};

const retrieveImages = (req: Request, res: Response) => {
  if (!validateAuthMobileRequest(req)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: MESSAGES.INCORRECT_MOBILE_REQUEST });
    return;
  }
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

const trackLocation = async (req: Request, res: Response) => {
  if (!validateAuthRequest(req)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: MESSAGES.INCORRECT_WEB_AUTH_REQUEST });
    return;
  }

  const { fcm_token, latitude, longitude } = req.body;

  const device = (await getMobileData(req.authData.userId)).filter(
    (token) => token.fcm_token == fcm_token
  )[0];
  if (!device?.last_location) {
    addMobileData(req.authData.userId, {
      fcm_token,
      last_location: { latitude, longitude },
    } as Device);

    res.json({ message: "okay" });
    return;
  }

  const metersDiff = geolib.getDistance(
    { latitude, longitude },
    device.last_location
  );

  if (metersDiff >= Number(process.env.LOCATION_DIFFERENCE_ON_SAVE)) {
    const user = await User.findOne({ username: req.authData.userId });
    const location = new Location({
      latitude: latitude,
      longitude: longitude,
      timestamp: Date.now(),
    });
    await location.save();
    const deviceDoc: DeviceDocument | null = await DeviceModel.findOne({
      fcm_token: fcm_token,
    });

    deviceDoc?.locations!.push(location);
    deviceDoc?.save();
    addMobileData(req.authData.userId, {
      fcm_token,
      last_location: { latitude, longitude },
    } as Device);

    user?.save();
  }

  res.json({ message: "okay" });
};

const lastLocations = async (req: Request, res: Response) => {
  if (!validateAuthRequest(req)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: MESSAGES.INCORRECT_WEB_AUTH_REQUEST });
    return;
  }

  const lastLocations = (await getMobileData(req.authData.userId)).map(
    (device) => ({ fcm_token: device.fcm_token, ...device?.last_location })
  );

  res.json({ message: lastLocations });
};

const devices = async (req: Request, res: Response) => {
  if (!validateAuthRequest(req)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: MESSAGES.INCORRECT_WEB_AUTH_REQUEST });
    return;
  }
  const result = await User.aggregate([
    { $match: { username: req.authData.userId } },
    {
      $lookup: {
        from: "devices",
        localField: "devices",
        foreignField: "_id",
        as: "devices",
      },
    },
    { $unwind: "$devices" },
    {
      $group: {
        _id: "$_id",
        devices: { $push: "$devices" },
      },
    },
  ])[0];

  res.json({
    message: (result?.devices ?? []).map((res: DeviceSchema) => res.full_model),
  });
};

const locationHistory = async (req: Request, res: Response) => {
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

const boot = async (req: Request, res: Response) => {
  if (!validateAuthRequest(req)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: MESSAGES.INCORRECT_WEB_AUTH_REQUEST });
    return;
  }
  const { brand, fcm_token } = req.body;

  const device: DeviceDocument | null = await DeviceModel.findOne({
    fcm_token,
  });

  device?.booted.push({ timestamp: Date.now() });
  device?.save();

  await mobileNotify(
    { method: "POST", originalUrl: "/boot", brand },
    req.authData.userId
  );

  res.json({ message: "okay" });
};

const bootHistory = async (req: Request, res: Response) => {
  const { fcm_token } = req.params;
  const device: DeviceSchema | null = await DeviceModel.findOne({
    fcm_token,
  });

  res.json({ message: device?.booted });
};

export default {
  incorrectPassword,
  locationHistory,
  trackLocation,
  lastLocations,
  retrieveImages,
  startDeviceLocation,
  bootHistory,
  devices,
  boot,
};
