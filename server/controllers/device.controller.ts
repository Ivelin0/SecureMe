import express, { Request, Response } from "express";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import * as admin from "firebase-admin";
import { ws_smart_client } from "../server";
import geolib from "geolib";
import fs from "fs";
import path from "path";
import { getTokens } from "../utility/redis/redis.operations";

import { fcmNotify } from "../utility/helper";

import { STATUSES, Callback } from "../models/resources/callback.model";
import { StatusCodes } from "http-status-codes";

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

const track_location = (req: Request, res: Response) => {
  const { latitude, longtiude } = req.body;
  console.log(req.body);

  res.json({ message: "okay" });
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
  track_location,
  retrieveImages,
  device_locations,
  boot,
};
