import express from "express";
import { getActiveStreams,createLiveStream, updateLiveStreamStatus } from "../../controllers/LiveStreamControllers/livestream.controller.js";
import { validateToken } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/permission.middleware.js";


const router = express.Router();

// Route to get active live streams
router.get("/",validateToken, authorize(["Admin","create_live"]), getActiveStreams);

// Route to create a live stream
router.post("/create",validateToken,authorize(["Admin","create_live"]), createLiveStream);

router.put(
  "/update/:id",
  validateToken,
  authorize(["Admin", "update_live"]),
  updateLiveStreamStatus
);

export default router;
