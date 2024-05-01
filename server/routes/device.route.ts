import { authorizedHTTP } from "../middlewares/auth.middleware";
import deviceController from "../controllers/device.controller";
import express from "express";
import upload from "../middlewares/upload.middleware";

const router = express.Router();

router.get("/locations", authorizedHTTP, deviceController.startDeviceLocation);

router.delete("/locations", deviceController.startDeviceLocation);

router.get("/images/:fcm_token", deviceController.retrieveImages);

router.post("/boot", [authorizedHTTP], deviceController.boot);

router.get("/boot/:fcm_token", deviceController.bootHistory);

router.post("/trackLocation", [authorizedHTTP], deviceController.trackLocation);

router.post(
  "/locationHistory",
  [authorizedHTTP],
  deviceController.locationHistory
);

router.post(
  "/incorrectPassword",
  [authorizedHTTP, upload.single("image")],
  deviceController.incorrectPassword
);

export default router;
