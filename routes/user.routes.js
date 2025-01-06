import express from "express";
import { validateToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/permission.middleware.js";
import {
  createUser,
  assignRoleToUser,
  removeRoleFromUser,
  assignPermissionToUser,
  removePermissionFromUser,
  deleteUser,
  viewUsers,
  editUser,
  getUserPermissions
} from "../controllers/user.controller.js";
import { getCategoryUsers } from "../controllers/userCategory.controller.js";

const router = express.Router();

// Protect routes with token validation and role-based authorization
router.post("/create", validateToken, authorize(["Admin"]), createUser);
router.post(
  "/assign-role",
  validateToken,
  authorize(["Admin"]),
  assignRoleToUser
);
router.post(
  "/remove-role",
  validateToken,
  authorize(["Admin"]),
  removeRoleFromUser
);
router.post(
  "/assign-permission",
  validateToken,
  authorize(["Admin"]),
  assignPermissionToUser
);
router.post(
  "/remove-permission",
  validateToken,
  authorize(["Admin"]),
  removePermissionFromUser
);
router.delete("/:userId", validateToken, authorize(["Admin"]), deleteUser);
router.get("/", validateToken, authorize(["Admin"]), viewUsers);
router.put("/:userId", validateToken, authorize(["Admin"]), editUser);

// get permssion by user
router.get("/user-permissions/:userId/permissions", getUserPermissions);

//  get users by category special case

router.get(
  "/cateogry-users/:categoryId",
  validateToken,
  authorize(["Admin"], getCategoryUsers)
);


export default router;
