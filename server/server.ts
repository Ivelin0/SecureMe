import express from "express";
import { IncomingMessage, createServer } from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import { SecureMeWebSocket } from "./models/resources/websocket.model";
import * as admin from "firebase-admin";
import serviceAccount from "./me-3d1ec-firebase-adminsdk-juyzr-dfbbe13ca9.json";
import deviceRouter from "./routes/device.route";
import userRouter from "./routes/user.route";
const path = require("path");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const app = express();
const server = createServer(app);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/images", express.static(path.join(__dirname, "images")));

const ws_web_client = new WebSocketServer({ noServer: true });
export const ws_smart_client = new WebSocketServer({ noServer: true });

app.use(deviceRouter, userRouter);

ws_smart_client.on(
  "connection",
  function connection(ws: SecureMeWebSocket, request: IncomingMessage) {
    ws.on("error", console.error);

    const id = request?.url?.substring(1);
    ws.brand = id ?? "unkown";

    ws.on("message", (data: Buffer) => {
      ws_web_client.clients.forEach((client: any) => {
        client.send(
          JSON.stringify({
            event: "locations",
            message: JSON.parse(data.toString()),
          })
        );
      });
    });

    ws.on("ping", function message(_data: Buffer) {
      ws.send("pong");
    });
  }
);

server.on("upgrade", function upgrade(request, socket, head) {
  const pathname = request.url;
  if (pathname == "/smart_client")
    ws_smart_client.handleUpgrade(request, socket, head, (ws) => {
      ws_smart_client.emit("connection", ws, request);
    });
  else if (pathname == "/web_client")
    ws_web_client.handleUpgrade(request, socket, head, (ws) => {
      ws_web_client.emit("connection", ws, request);
    });
  else socket.destroy();
});

server.listen(8000, () => {
  console.log("Server is on");
});
