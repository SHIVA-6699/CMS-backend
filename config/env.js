import dotenv from "dotenv";
dotenv.config();

export const config = {
  jwtSecret:
    process.env.JWT_SECRET ||
    "ee03e39b70572d8515b480aa98defc21b74e437dffdd61190f3670b43306f92c",
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  node_env:process.env.NODE_ENV
};
