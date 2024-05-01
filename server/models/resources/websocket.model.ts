import WebSocket from "ws";
import { authData } from "./auth.model";

export interface SmartClientWebSocket extends WebSocket {
  userId: string;
  fcm_token: string;
  authData: authData;
}

export interface WebClientWebSocket extends WebSocket {
  authData?: authData;

  isAlive?: boolean;
}
