import Content from "../../models/NewsContentModels/content.model.js";

import productCategoryModel from "../../models/productCateogory.model.js";
// Create Content
export const createContent = async (req, res) => {
  const {
    title,
    subtitle,
    description,
    subDescription,
    image,
    externalLink,
    youtubeVideoLink,
    categoryId,
  } = req.body;

  try {
    
    const category = await productCategoryModel.findById(categoryId);
    console.log(category)
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const content = new Content({
      title,
      subtitle,
      description,
      subDescription,
      image,
      externalLink,
      youtubeVideoLink,
      category: categoryId,
      createdBy: req.user.userId,
    });

    await content.save();
    res.status(201).json({ message: "Content created successfully", content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit Content
export const editContent = async (req, res) => {
  const {
    contentId,
    title,
    subtitle,
    description,
    subDescription,
    image,
    externalLink,
    youtubeVideoLink,
  } = req.body;

  try {
    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ message: "Content not found" });

    content.title = title || content.title;
    content.subtitle = subtitle || content.subtitle;
    content.description = description || content.description;
    content.subDescription = subDescription || content.subDescription;
    content.image = image || content.image;
    content.externalLink = externalLink || content.externalLink;
    content.youtubeVideoLink = youtubeVideoLink || content.youtubeVideoLink;
    content.updatedAt = Date.now();

    await content.save();
    res.status(200).json({ message: "Content updated successfully", content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Content
export const deleteContent = async (req, res) => {
  const { contentId } = req.body;

  try {
    const content = await Content.findByIdAndDelete(contentId);
    if (!content) return res.status(404).json({ message: "Content not found" });

    res.status(200).json({ message: "Content deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// View All Content
export const viewAllContent = async (req, res) => {
  try {
    const contentList = await Content.find()
      .populate("category", "name description")
      .populate("createdBy", "name email");

    res.status(200).json({ content: contentList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// View Content by Category
export const viewContentByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const contentList = await Content.find({ category: categoryId })
      .populate("category", "name description")
      .populate("createdBy", "name email");

    if (contentList.length === 0) {
      return res
        .status(404)
        .json({ message: "No content found for this category" });
    }

    res.status(200).json({ content: contentList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

