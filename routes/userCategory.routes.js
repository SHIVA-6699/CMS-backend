import express from "express";
import {
  createUserCategory,
  editUserCategory,
  deleteUserCategory,
  viewUserCategories,
  viewUserCategoryById,
} from "../controllers/userCategory.controller.js";
import { validateToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/permission.middleware.js";

const router = express.Router();

// Create User Category
router.post(
  "/create",
  validateToken,
  authorize(["Admin", "create_user_category"]),
  createUserCategory
);

// Edit User Category
router.put(
  "/edit",
  validateToken,
  authorize(["Admin", "edit_user_category"]),
  editUserCategory
);

// Delete User Category
router.delete(
  "/delete",
  validateToken,
  authorize(["Admin", "delete_user_category"]),
  deleteUserCategory
);

// View User Categories
router.get(
  "/view",
  validateToken,
  authorize(["Admin", "view_user_category"]),
  viewUserCategories
);

router.get(
  "/get-category-by-id/:categoryId",
  validateToken,
  authorize(["Admin","view_user_category"]),
  viewUserCategoryById
)

export default router;
