import {
  authorizedMobileRequest,
  authorizedRequest,
} from "../models/resources/auth.model";

import { Request } from "express";

export function validateAuthRequest(req: Request): req is authorizedRequest {
  return (req as any).authData !== undefined;
}

export function validateAuthMobileRequest(
  req: Request
): req is authorizedMobileRequest {
  return (req as any).authData?.fcm_token !== undefined;
}
