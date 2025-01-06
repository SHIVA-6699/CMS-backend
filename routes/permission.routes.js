import express from "express";
import { validateToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/permission.middleware.js";
import {
  createPermission,
  viewPermissions,
  editPermission,
  deletePermission,
} from "../controllers/permission.controller.js";

const router = express.Router();

// Protect routes with token validation and role-based authorization
router.post("/create", validateToken, authorize(["Admin"]), createPermission);
router.get("/", validateToken, authorize(["Admin"]), viewPermissions);
router.put(
  "/:permissionId",
  validateToken,
  authorize(["Admin"]),
  editPermission
);
router.delete(
  "/:permissionId",
  validateToken,
  authorize(["Admin"]),
  deletePermission
);

export default router;
