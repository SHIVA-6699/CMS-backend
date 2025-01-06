import mongoose from "mongoose";

const UserPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  contentPreferences: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory", // Link to categories
    },
  ],
  notifications: {
    type: Object,
    default: {
      breakingNews: true,
      categoryAlerts: false,
      dailyDigest: true,
    },
  },
  darkMode: { type: Boolean, default: false },
  language: { type: String, default: "en" },
});

export const UserPreferences = mongoose.model(
  "UserPreferences",
  UserPreferencesSchema
);
