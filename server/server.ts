import express from "express";
import { IncomingMessage, createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";
import cors from "cors";
import {
  SmartClientWebSocket,
  WebClientWebSocket,
} from "./models/resources/websocket.model";
import * as admin from "firebase-admin";
import serviceAccount from "./me-3d1ec-firebase-adminsdk-juyzr-dfbbe13ca9.json";
import deviceRouter from "./routes/device.route";
import userRouter from "./routes/user.route";
import mongoose from "mongoose";
import * as redis from "redis";
import jwt from "jsonwebtoken";
import { authorizedHTTP, authorizedWS } from "./middlewares/auth.middleware";
import { parseQueryParams, isAuthorized } from "./utility/helper";
import { locationHandler } from "./controllers/device.controller";
import SecureMeRequest from "./models/resources/request.model";
import * as dotenv from "dotenv";

dotenv.config();
const path = require("path");

mongoose
  .connect("mongodb://127.0.0.1:27017/secureme")
  .then(() => console.log("Connected!"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const clientRedis = redis.createClient();
const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: ["https://secureme.live"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ws_web_client = new WebSocketServer({ noServer: true });
export const ws_smart_client = new WebSocketServer({ noServer: true });

app.use(deviceRouter, userRouter);

app.use("/images", express.static(path.join(__dirname, "images")));

ws_smart_client.on(
  "connection",
  async function connection(
    ws: SmartClientWebSocket,
    request: SecureMeRequest
  ) {
    await authorizedWS(request);
    ws.userId = request.userId;

    ws.on("message", async (data: Buffer) => {
      let find: boolean = false;
      ws_web_client.clients.forEach((client: any) => {
        if (client.userId != ws.userId) return;
        find = true;
        client.send(
          JSON.stringify({
            event: "locations",
            message: {
              ...JSON.parse(data.toString()),
              fcm_token: ws.fcm_token,
            },
          })
        );
      });
      if (!find)
        await locationHandler({
          method: "DELETE",
          userId: ws.userId,
          originalUrl: "/locations",
        });
    });

    ws.on("ping", function message(_data: Buffer) {
      ws.send("pong");
    });
    ws.send("ping");
  }
);

ws_web_client.on(
  "connection",
  async function connection(ws: WebClientWebSocket, request: SecureMeRequest) {
    ws.isAlive = true;
    await authorizedWS(request);
    ws.userId = request.userId;

    ws.on("message", () => {
      ws.isAlive = true;
    });
  }
);

ws_web_client.on("close", () => {});

app.get("/ws-ticket", authorizedHTTP, (req: any, res: express.Response) => {
  const username = req.userId;

  const auth_token = jwt.sign({ data: { username } }, "secret", {
    expiresIn: "24h",
  });

  res.status(200).send({ message: auth_token });
});

app.get(
  "/authenticate",
  authorizedHTTP,
  (req: express.Request, res: express.Response) => {
    res.status(200).send({ message: "okay" });
  }
);

server.on("upgrade", function upgrade(request: express.Request, socket, head) {
  console.log("trying to connect");
  if (!isAuthorized(request)) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();

    return;
  }

  const pathname = request?.url?.split("?")[0];
  const { auth_token, fcm_token } = parseQueryParams(request.url as string);
  console.log(pathname);
  if (pathname == "/smart_client")
    ws_smart_client.handleUpgrade(request, socket, head, (ws) => {
      request.headers.authorization = `Bearer ${auth_token}`;
      (ws as SmartClientWebSocket).fcm_token = fcm_token;
      ws_smart_client.emit("connection", ws, request);
    });
  else if (pathname == "/web_client")
    ws_web_client.handleUpgrade(request, socket, head, (ws) => {
      request.headers.authorization = `Bearer ${auth_token}`;
      ws_web_client.emit("connection", ws, request);
    });
  else socket.destroy();
});

const interval = setInterval(function ping() {
  ws_web_client.clients.forEach(async function each(ws: WebClientWebSocket) {
    if (ws.isAlive === false) {
      await locationHandler({
        method: "DELETE",
        userId: ws.userId,
        originalUrl: "/locations",
      });
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.send(JSON.stringify({ event: "", message: "ping" }));
  });
}, 2500);

server.listen(8000, () => {
  console.log("Server is on");
});
