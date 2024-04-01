import { StatusCodes } from "http-status-codes";

export enum STATUSES {
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export interface CallbackRespond {
  status: StatusCodes;
  message: string;
}

export interface Error extends CallbackRespond {
  type: STATUSES.ERROR;
}

export interface Success extends CallbackRespond {
  type: STATUSES.SUCCESS;
}

export type Callback = Error | Success;
