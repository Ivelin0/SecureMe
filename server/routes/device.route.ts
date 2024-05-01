import { authorizedHTTP } from "../middlewares/auth.middleware";
import deviceController from "../controllers/device.controller";
import express from "express";
import upload from "../middlewares/upload.middleware";

const router = express.Router();

router.get("/locations", authorizedHTTP, deviceController.device_locations);

router.delete("/locations", deviceController.device_locations);

router.get("/images/:fcm_token", deviceController.retrieveImages);

router.post("/boot", [authorizedHTTP], deviceController.boot);

router.get("/boot/:fcm_token", deviceController.bootHistory);

router.post(
  "/track_location",
  [authorizedHTTP],
  deviceController.track_location
);

router.post(
  "/location_history",
  [authorizedHTTP],
  deviceController.location_history
);

router.post(
  "/incorrect_password",
  [authorizedHTTP, upload.single("image")],
  deviceController.incorrect_password
);

export default router;
