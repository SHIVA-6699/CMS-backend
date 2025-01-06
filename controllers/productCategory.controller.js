
import productCategoryModel from "../models/productCateogory.model.js";
export const createproductCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const productCategory = new productCategoryModel({
      name,
      description,
      createdBy: req.user.userId,
    });
    await productCategory.save();
    res
      .status(201)
      .json({ message: "productCategory created successfully", productCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit a productCategory
export const editproductCategory = async (req, res) => {
  const { productCategoryId, name, description } = req.body;
  try {
    const productCategory = await productCategory.findById(productCategoryId);
    if (!productCategory)
      return res.status(404).json({ message: "productCategory not found" });

    productCategory.name = name || productCategory.name;
    productCategory.description = description || productCategory.description;
    productCategory.updatedAt = Date.now();
    await productCategory.save();

    res
      .status(200)
      .json({ message: "productCategory updated successfully", productCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a productCategory
export const deleteproductCategory = async (req, res) => {
  const { productCategoryId } = req.body;
  try {
    const productCategory = await productCategory.findByIdAndDelete(productCategoryId);
    if (!productCategory)
      return res.status(404).json({ message: "productCategory not found" });

    res.status(200).json({ message: "productCategory deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// View All Categories
export const viewproductCategories = async (req, res) => {
  try {
    const categories = await productCategoryModel.find().populate(
      "createdBy",
      "name email"
    );
    res.status(200).json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
