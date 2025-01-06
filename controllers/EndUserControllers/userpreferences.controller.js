import { UserPreferences } from "../../models/EndUserModels/userPreferences.model.js";
import Content from "../../models/NewsContentModels/content.model.js";
export const createUserPreferences = async (req, res) => {
  try {
    const { contentPreferences, notifications, darkMode, language } = req.body;

    // Use userId from the authenticated request
    const userId = req.user.userId;

    // Check if preferences already exist for the user
    const existingPreferences = await UserPreferences.findOne({ userId });

    if (existingPreferences) {
      return res.status(400).json({ message: "Preferences already exist for this user" });
    }

    // Create new preferences
    const newPreferences = new UserPreferences({
      userId,
      contentPreferences,
      notifications,
      darkMode,
      language,
    });

    await newPreferences.save();

    res.status(201).json({ message: "Preferences created successfully", preferences: newPreferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch User Preferences
export const getUserPreferences = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);

    const userPreferences = await UserPreferences.findOne({ userId }).populate(
      "contentPreferences",
      "name description"
    );

    if (!userPreferences) {
      return res.status(404).json({ message: "User preferences not found" });
    }

    res.status(200).json({ preferences: userPreferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update User Preferences
export const updateUserPreferences = async (req, res) => {
  const { contentPreferences, notifications, darkMode, language } = req.body;

  try {
    const userId = req.user.userId;

    let userPreferences = await UserPreferences.findOne({ userId });

    if (!userPreferences) {
      userPreferences = new UserPreferences({ userId });
    }

    if (contentPreferences) userPreferences.contentPreferences = contentPreferences;
    if (notifications) userPreferences.notifications = notifications;
    if (darkMode !== undefined) userPreferences.darkMode = darkMode;
    if (language) userPreferences.language = language;

    await userPreferences.save();

    res
      .status(200)
      .json({ message: "Preferences updated successfully", preferences: userPreferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete User Preferences
export const deleteUserPreferences = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userPreferences = await UserPreferences.findOneAndDelete({ userId });

    if (!userPreferences) {
      return res.status(404).json({ message: "User preferences not found" });
    }

    res.status(200).json({ message: "Preferences deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch Personalized Content Based on Preferences
export const getPersonalizedContent = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract user ID from the request
    console.log("User ID:", userId);

    // Check if user preferences exist
    let userPreferences = await UserPreferences.findOne({ userId }).populate(
      "contentPreferences",
      "name description"
    );

    // If preferences do not exist, create an empty preferences document
    if (!userPreferences) {
      console.log("No user preferences found. Creating a new document...");
      userPreferences = new UserPreferences({
        userId,
        contentPreferences: [], // Initialize with an empty array or default preferences
      });
      await userPreferences.save();
    }

    console.log("User Preferences:", userPreferences);

    // Get the preferred categories (if any)
    const preferredCategories = userPreferences.contentPreferences.map(
      (category) => category._id
    );

    // Fetch content based on preferred categories
    const personalizedContent = await Content.find({
      category: { $in: preferredCategories },
    })
      .populate("category", "name description")
      .populate("createdBy", "name email");

    res.status(200).json({ content: personalizedContent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
