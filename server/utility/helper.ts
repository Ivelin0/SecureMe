import express, { Request, Response } from "express";
import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";
import * as admin from "firebase-admin";
import { getTokens } from "./redis/redis.operations";
import { STATUSES, Callback } from "../models/resources/callback.model";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../schemas/user.schema";

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
  file_path?: string;
}

export const fcmNotify = async (
  { method, originalUrl, file_path = "" }: fcmData,
  userId: string
) => {
  (await getTokens(userId))
    .map(({ fcm_token }) => fcm_token)
    .filter((fcm_token) => fcm_token != null);
  const message: MulticastMessage = {
    data: {
      method: method,
      route: originalUrl,
      file_path,
    },
    android: {
      priority: "high",
    },
    apns: {
      headers: {
        "apns-priority": "10",
      },
    },
    tokens: (await getTokens(userId))
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
