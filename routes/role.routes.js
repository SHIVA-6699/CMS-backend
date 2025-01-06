import express from "express";
import { validateToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/permission.middleware.js";
import {
  createRole,
  viewRoles,
  editRole,
  deleteRole,
  addPermissionToRole,
  removePermissionFromRole,
  getPermissionsForRole
} from "../controllers/role.controller.js";

const router = express.Router();

// Protect routes with token validation and role-based authorization
router.post("/create", validateToken, authorize(["Admin"]), createRole);
router.get("/", validateToken, authorize(["Admin"]), viewRoles);
router.put("/:roleId", validateToken, authorize(["Admin"]), editRole);
router.delete("/:roleId", validateToken, authorize(["Admin"]), deleteRole);
router.post(
  "/:roleId/add-permissions", 
  validateToken,
  authorize(["Admin"]),
  addPermissionToRole
);

router.post(
  "/:roleId/remove-permissions", 
  validateToken,
  authorize(["Admin"]),
  removePermissionFromRole
);
router.get(
  "/:roleId/permissions",
  validateToken,
  authorize(["Admin"]),
  getPermissionsForRole
);

export default router;
