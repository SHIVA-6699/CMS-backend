import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const validateToken = (req, res, next) => {
  // const token = req.headers.authorization.split(" ")[1]; 
  const token = req.headers.authorization

  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // Store the decoded user data in req.user

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token." });
  }
};
