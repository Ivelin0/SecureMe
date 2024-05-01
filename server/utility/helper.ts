import * as admin from "firebase-admin";

import { Callback, STATUSES } from "../models/resources/callback.model";
import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";
import { StatusCodes } from "http-status-codes";
import { User } from "../schemas/user.schema";
import { getMobileData } from "./redis/redis.operations";

export const parseQueryParams = (queryParams: string) => {
  const query = queryParams.split("&");
  query[0] = query[0].split("?")[1];

  return Object.assign(
    {},
    ...query.map((param) => {
      const [key, value] = param.split("=");
      return {
        [key]: value,
      };
    })
  );
};

interface fcmData {
  method: string;
  originalUrl: string;
  brand?: string;
}

export const mobileNotify = async (
  { method, originalUrl, brand = "" }: fcmData,
  userId: string
) => {
  (await getMobileData(userId))
    .map(({ fcm_token }) => fcm_token)
    .filter((fcm_token) => fcm_token != null);
  const message: MulticastMessage = {
    data: {
      method: method,
      route: originalUrl,
      brand,
    },
    android: {
      priority: "high",
    },
    apns: {
      headers: {
        "apns-priority": "10",
      },
    },
    tokens: (await getMobileData(userId))
      .map(({ fcm_token }) => fcm_token)
      .filter((fcm_token) => fcm_token != null),
  };

  return admin
    .messaging()
    .sendEachForMulticast(message)
    .then((_response): Callback => {
      return {
        type: STATUSES.SUCCESS,
        status: StatusCodes.OK,
        message: "Successfully sent message",
      };
    })
    .catch((_error) => {
      return {
        type: STATUSES.ERROR,
        status: StatusCodes.SERVICE_UNAVAILABLE,
        message: "Error sending message",
      };
    });
};

export const isAuthorized = async (request: any) => {
  const { headers } = request;
  const isAuthorized = headers?.cookie?.search("auth_token");
  if (isAuthorized && isAuthorized != -1) {
    const auth_token = headers?.cookie?.split("=")[1];
    const { data } = jwt.verify(auth_token, "secret") as JwtPayload;
    const isValid = await User.findOne({ username: data.username });
    return isValid;
  }
  return false;
};
