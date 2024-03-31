const express = require("express");
const server = express();

const Cookies = require("cookies");
const cors = require("cors");

server.use(
  cors({
	  origin: ["https://secureme.live"],
    credentials: true,
  })
);

const {
  createProxyMiddleware,
  responseInterceptor,
} = require("http-proxy-middleware");

const apiProxy = createProxyMiddleware({
  target: "http://localhost:8000",
  pathRewrite: { [`^/api`]: "" },
  secure: true,
  ws: true,
  onProxyReq: async (proxyReq, req) => {
    const cookies = new Cookies(req);
    const accessToken = cookies.get("auth_token");
    if (accessToken) {
      proxyReq.setHeader("Authorization", `Bearer ${accessToken}`);
    }
  },
  onProxyReqWs: (proxyReq, req) => {
    const cookies = new Cookies(req);
    const accessToken = cookies.get("auth_token");
    if (accessToken) {
      proxyReq.setHeader("Authorization", `Bearer ${accessToken}`);
    }
  },
});
const apiAuthenticate = createProxyMiddleware({
  target: "http://localhost:8000",
  changeOrigin: true,
  pathRewrite: { [`^/api`]: "" },
  secure: false,
  selfHandleResponse: true,
  onProxyRes: responseInterceptor(
    async (responseBuffer, proxyRes, req, res) => {
      if (
        proxyRes.headers["content-type"] === "application/json; charset=utf-8"
      ) {
        let stringifiedJSON = String.fromCharCode.apply(
          null,
          responseBuffer.toJSON("utf8").data
        );
        data = JSON.parse(stringifiedJSON);
        res.cookie("auth_token", data.auth_token, {
          secure: false,
          httpOnly: true,
          sameSite: "Lax",
        });
      }
      return responseBuffer;
    }
  ),
});

server.use(["/api/login", "/api/register"], apiAuthenticate);
server.use("/api", apiProxy);

server.listen(5000, () => {
  console.log("proxy is on");
});