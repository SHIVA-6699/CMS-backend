import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { config } from "../config/env.js";

// Function to login a user and generate a JWT and Refresh Token
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email }).populate({
        path: "roleId",
        populate: {
          path: "permissions",
          model: "Permission",
        },
      })
      .populate("permissions");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
 const userRole = user.roleId.name;
 const rolePermissions = user.roleId.permissions.map((perm) => perm.name);
 const userPermissions = user.permissions.map((perm) => perm.name);

   const combinedPermissions = [
     ...new Set([...rolePermissions, ...userPermissions]),
   ];
    // Create a JWT (Access Token)
    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        rolePer:userRole,
        name: user.name,
        permissions: combinedPermissions,
      },
      config.jwtSecret, // Secret key from config
      { expiresIn: "1h" } // Expire the access token after 1 hour
    );

    // Create a Refresh Token
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role, name: user.name, rolePer: userRole },
      config.jwtSecret, // Use a different secret key for refresh tokens (or the same)
      { expiresIn: "7d" } // Expire the refresh token after 7 days
    );
      res.cookie("refreshToken", refreshToken, {
        secure: config.node_env === "development" ? true : false,
      });
    // Send both tokens to the client
    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      permissions: combinedPermissions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};







export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {  
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, config.jwtSecret);

    // Find the user associated with the refresh token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new access token (JWT)
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.roleId.name },
      config.jwtSecret, // Secret key for the access token
      { expiresIn: "1h" } // Expire the access token after 1 hour
    );

    // Send the new access token to the client
    res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};






export const signup = async (req, res) => {
  const { name, email, password, roleId } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Check if the role exists
    const role = await Role.findById(roleId);
    if (!role) return res.status(404).json({ message: "Role not found" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create and save the new user
    const newUser = new User({ name, email, password: hashedPassword, roleId });
    await newUser.save();

    res
      .status(201)
      .json({ message: "Signup successful", user: { name, email, roleId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
