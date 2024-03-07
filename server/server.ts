import express, { Request, Response } from "express";
import { IncomingMessage, createServer } from "http";
import { WebSocketServer } from "ws";
import { Server as HttpServer } from "http";
import WebSocket from "ws";
import { SecureMeWebSocket } from "./models/resources/websocket.model";

const app: express.Application = express();
const server: HttpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const wss1 = new WebSocketServer({ noServer: true });

wss1.on(
  "connection",
  function connection(ws: SecureMeWebSocket, request: IncomingMessage) {
    ws.on("error", console.error);

    const id = request?.url?.substring(1);
    ws.brand = id ?? "unkown";

    ws.on("ping", function message(_data: Buffer) {
      ws.send("pong");
    });
  }
);

server.on("upgrade", function upgrade(request, socket, head) {
  wss1.handleUpgrade(request, socket, head, function done(ws: WebSocket) {
    wss1.emit("connection", ws, request);
  });
});

app.post("/boot", (req: Request, res: Response) => {
  const { brand } = req.body;

  wss1.clients.forEach(function each(client: any) {
    if (client.id !== brand)
      client.send(JSON.stringify({ event: "boot", message: brand }));
  });

  res.json({ message: "okay" });
});

server.listen(8000, () => {
  console.log("Server is on");
});
