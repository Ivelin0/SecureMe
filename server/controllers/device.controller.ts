import express, { Request, Response } from "express";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import * as admin from "firebase-admin";
import { ws_smart_client } from "../server";
import fs from "fs";
import path from "path";

const device_locations = (req: Request, res: Response) => {
  const message: Message = {
    data: {
      method: req.method,
      route: req.originalUrl,
    },
    topic: "location",
    android: {
      priority: "high",
    },
    apns: {
      headers: {
        "apns-priority": "10",
      },
    },
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
      res.status(200).send({ message: "Successfully sent message" });
    })
    .catch((error) => {
      console.log("Error sending message:", error);
      res.status(503).send({ message: "Error sending message" });
    });
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

const boot = (req: Request, res: Response) => {
  const { brand } = req.body;

  ws_smart_client.clients.forEach(function each(client: any) {
    if (client.id !== brand)
      client.send(JSON.stringify({ event: "boot", message: brand }));
  });

  res.json({ message: "okay" });
};

export default { incorrect_password, retrieveImages, device_locations, boot };
