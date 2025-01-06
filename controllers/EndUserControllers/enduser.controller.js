import EndUser from "../../models/EndUserModels/enduser.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config/env.js";

export const signupEndUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const endUser = new EndUser({
      name,
      email,
      password: hashedPassword,
    });

    await endUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", data: endUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginEndUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const endUser = await EndUser.findOne({ email });
    if (!endUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, endUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: endUser._id },config.jwtSecret, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateEndUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const endUser = await EndUser.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    if (!endUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", data: endUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const uploadImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const image = req.file.path; 

    const endUser = await EndUser.findByIdAndUpdate(
      id,
      { image },
      { new: true }
    );

    if (!endUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Image uploaded successfully", data: endUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




