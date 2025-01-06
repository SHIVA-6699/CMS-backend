import express from "express";
import { validateToken } from "../../middlewares/auth.middleware.js";
import {
  getPersonalizedContent,
  updateUserPreferences,
  createUserPreferences,
  getUserPreferences,
  deleteUserPreferences,
} from "../../controllers/EndUserControllers/userpreferences.controller.js";

const router = express.Router();

// Route to fetch personalized content based on user preferences
router.get("/personalized", validateToken, getPersonalizedContent);

// Route to update user preferences
router.put("/update", validateToken, updateUserPreferences);

// Route to create user preferences
router.post("/create", validateToken, createUserPreferences);

// Route to fetch user preferences
router.get("/view", validateToken, getUserPreferences);

// Route to delete user preferences
router.delete("/delete", validateToken, deleteUserPreferences);

export default router;
