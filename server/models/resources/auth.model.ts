import { Request } from "express";

export interface authData {
  userId: string;
  auth_token: string;
}

export interface authMobileData extends authData {
  fcm_token: string;
}

export interface authorizedRequest extends Request {
  authData: authData;
}

export interface authorizedMobileRequest extends Request {
  authData: authMobileData;
}
