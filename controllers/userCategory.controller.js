import UserCategory from "../models/userCategory.model.js";
import User from "../models/user.model.js";

// Create a User Category
export const createUserCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = new UserCategory({
      name,
      description,
      createdBy: req.user.userId,
    });

    await category.save();
    res
      .status(201)
      .json({ message: "User category created successfully", category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit a User Category
export const editUserCategory = async (req, res) => {
  const { categoryId, name, description } = req.body;

  try {
    const category = await UserCategory.findById(categoryId);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    category.name = name || category.name;
    category.description = description || category.description;
    category.updatedAt = Date.now();
    await category.save();

    res
      .status(200)
      .json({ message: "User category updated successfully", category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a User Category
export const deleteUserCategory = async (req, res) => {
  const { categoryId } = req.body;
  try {
    const category = await UserCategory.findByIdAndDelete(categoryId);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    // Remove the category reference from users
    await User.updateMany(
      { categoryId: categoryId },
      { $unset: { categoryId: 1 } }
    );

    res.status(200).json({ message: "User category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// View All User Categories
export const viewUserCategories = async (req, res) => {
  try {
    const categories = await UserCategory.find().populate(
      "users",
      "name email"
    );
    res.status(200).json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getCategoryUsers = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Find the category and populate the users field
    const category = await UserCategory.findById(categoryId).populate("users");

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({
      message: "Users fetched successfully",
      categoryName: category.name,
      users: category.users,
    });
  } catch (err) {
    console.error("Error fetching users by category:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// View a User Category by ID
export const viewUserCategoryById = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await UserCategory.findById(categoryId).populate("users", "name email");
    
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
