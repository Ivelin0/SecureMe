import express from "express";
import deviceController from "../controllers/device.controller";
import upload from "../middlewares/upload.middleware";
import { authorizedHTTP } from "../middlewares/auth.middleware";

const router = express.Router();


router.get("/images/:fcm_token", deviceController.retrieveImages);


router.post(
  "/incorrect_password",
  [authorizedHTTP, upload.single("image")],
  deviceController.incorrect_password
);
export default router;