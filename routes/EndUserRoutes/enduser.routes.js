import multer from "multer";
import express from "express";
import {
  loginEndUser,
  updateEndUser,
  uploadImage,
  signupEndUser,
} from "../../controllers/EndUserControllers/enduser.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
const router = express.Router();

// Middleware for file upload
// const upload = multer({ dest: "uploads/" });

router.post("/signup", signupEndUser);
router.post("/login", loginEndUser);
router.put("/update/:id", updateEndUser);
router.post("/upload/:id", upload.single("image"), uploadImage);
export default router;
