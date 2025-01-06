import express from "express";
import { login, refreshToken } from "../controllers/auth.controller.js"; // Single login handler

const router = express.Router();

// User and Admin login (same route for both)
router.post("/login", login);
router.post("/refresh-token",refreshToken);

export default router;
