import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { initializeAdmin } from "./controllers/admin.controller.js";
import roleRoutes from "./routes/role.routes.js";
import userRoutes from "./routes/user.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import loginRoutes from "./routes/auth.routes.js";
import productCategoryRoutes from "./routes/productCategory.routes.js";
import userCategories from "./routes/userCategory.routes.js";
import contentCategories from "./routes/NewsContentRoutes/content.routes.js";
import endUser from "./routes/EndUserRoutes/enduser.routes.js";
import forgotPassowrd from "./routes/EndUserRoutes/forgotpassowrd.routes.js";
import userPreferences from "./routes/EndUserRoutes/userPreferences.route.js";
import newsAlertRoutes from "./routes/NewsAlertRoutes/newsAlert.route.js";
import LiveStreamRoutes from "./routes/LiveStreamRoutes/livestream.route.js"
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from "cookie-parser";
import auditLogger from "./middlewares/auditLogger.middleware.js";
import auditLogs from "./routes/auditlog.router.js";

// Initialize express app
const app = express();

// Create the HTTP server from the express app
export const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

dotenv.config();
// Middleware
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173", // Your frontend origin
  credentials: true, // Allow sending cookies/credentials
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(auditLogger);
// app.set("io", io); 
// Routes
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/product-categories", productCategoryRoutes);
app.use("/api/user-category", userCategories);
app.use("/api/category-content", contentCategories);
app.use("/api/auth/end-user", endUser);
app.use("/api/auth/forgot-password", forgotPassowrd);
app.use("/api/user-preferences", userPreferences);
app.use("/api/news-alert", newsAlertRoutes);
app.use("/api/live-stream",LiveStreamRoutes);
app.use("/api/audit-logs",auditLogs)

// connectRabbitMQ(io);
// socketService(io)
// Initialize Admin on Startup
initializeAdmin();

// Connect to Database
connectDB();



// Start the server with the HTTP server (with Socket.IO)
export default app;
