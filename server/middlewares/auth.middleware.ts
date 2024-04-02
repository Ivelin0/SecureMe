import express from "express";
import jwt from "jsonwebtoken";
import statusCodes from "http-status-codes";
import { STATUSES, Error, Success } from "../models/resources/callback.model";
import { SecureMeJWT } from "../models/resources/jwt.model";

const attachUserId = async (req: any): Promise<Error | Success> => {
  const auth_token = req.headers.authorization?.split(" ")[1];
  if (!auth_token)
    return {
      type: STATUSES.ERROR,
      status: statusCodes.UNAUTHORIZED,
      message: "You need to log in first",
    };
  let decoded_data: SecureMeJWT = { data: {} };
  try {
    decoded_data = (await jwt.verify(
      auth_token as string,
      String(process.env.JWT_LONGLIVED)
    )) as SecureMeJWT;
  } catch (e) {
    return {
      type: STATUSES.ERROR,
      status: statusCodes.UNAUTHORIZED,
      message: "Session expired",
    };
  }
  const { username }: any = decoded_data.data;
  req.userId = username;
  req.auth_token = auth_token;
  return {
    type: STATUSES.SUCCESS,
    status: statusCodes.OK,
    message: "proceed",
  };
};

export const authorizedHTTP = async (
  req: any,
  res: express.Response,
  next: express.NextFunction
) => {
  const authorization = await attachUserId(req);
  if (authorization.type == STATUSES.SUCCESS) next();
  else
    res.status(authorization.status).json({ message: authorization.message });
};

export const authorizedWS = async (req: any) => {
  let res = await attachUserId(req);
  return res;
};
