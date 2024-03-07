import WebSocket from "ws";

export interface SecureMeWebSocket extends WebSocket {
  brand: String;
}
