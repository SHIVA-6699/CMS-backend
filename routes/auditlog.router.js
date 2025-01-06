import express from "express";
import { getAuditLogs } from "../controllers/auditlog.controller.js";
const router = express.Router();

// User and Admin login (same route for both)
router.get("/",getAuditLogs);

export default router;
