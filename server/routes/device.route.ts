import express from "express";
const router = express.Router();
import deviceController from "../controllers/device.controller";

router.get("/locations", deviceController.device_locations);
router.delete("/locations", deviceController.device_locations);

router.get("/post", deviceController.boot);

export default router;
