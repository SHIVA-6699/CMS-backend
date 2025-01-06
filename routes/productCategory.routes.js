import express from "express";
import {
  createproductCategory,
  editproductCategory,
  deleteproductCategory,
  viewproductCategories,
} from "../controllers/productCategory.controller.js";
import { validateToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/permission.middleware.js";

const router = express.Router();

// Create Category
router.post(
  "/create",
  validateToken,
  authorize(["Admin", "create_product_category"]),
  createproductCategory
);

// Edit Category
router.put(
  "/edit",
  validateToken,
  authorize(["Admin", "edit_product_category"]),
  editproductCategory
);

// Delete Category
router.delete(
  "/delete",
  validateToken,
  authorize(["Admin", "delete_product_category"]),
  deleteproductCategory
);

// View Categories
router.get(
  "/view",
  validateToken,
  authorize(["Admin", "view_product_category"]),
  viewproductCategories
);

export default router;
