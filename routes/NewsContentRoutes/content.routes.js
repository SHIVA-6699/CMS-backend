import express from "express";
import {
  createContent,
  editContent,
  deleteContent,
  viewAllContent,
  viewContentByCategory,
} from "../../controllers/NewsContentControllers/content.controller.js";
import { validateToken } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/permission.middleware.js";

const router = express.Router();

// Middleware to check permissions (only admins by default)

// Admin-only routes
router.post(
  "/create",
  validateToken,
  authorize(["Admin", "create_content"]),
  createContent
); // Create content
router.put(
  "/edit",
  validateToken,
  authorize(["Admin", "edit_content"]),
  editContent
); // Edit content
router.delete(
  "/delete",
  validateToken,
  authorize(["Admin", "delete_content"]),
  deleteContent
); // Delete content

// Public routes (accessible without authentication)
router.get("/all", viewAllContent); // View all content
router.get("/category/:categoryId", viewContentByCategory); // View content by category

export default router;
