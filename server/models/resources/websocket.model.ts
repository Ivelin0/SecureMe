import WebSocket from "ws";

export interface SmartClientWebSocket extends WebSocket {
  userId: String;
  fcm_token: String;
}

export interface WebClientWebSocket extends WebSocket {
  userId?: String;
  isAlive?: boolean;
}
