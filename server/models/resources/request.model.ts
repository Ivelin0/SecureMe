import { Request } from "express";

export default interface SecureMeRequest extends Request {
  userId: String;
}
