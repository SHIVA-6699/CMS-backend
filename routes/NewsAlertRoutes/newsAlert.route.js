import express from "express";
import { createAlert } from "../../controllers/AlertsControllers/newsAlert.controller.js";
import { validateToken } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/permission.middleware.js";

const router = express.Router();

// User and Admin login (same route for both)
router.post("/create-alert", validateToken, authorize(["Admin"]), createAlert);

export default router;
