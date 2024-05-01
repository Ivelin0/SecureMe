import { Request } from "express";
import { authData } from "./auth.model";
export default interface SecureMeRequest extends Request {
  authData: authData;
}
