import NewsAlert from "../../models/AlertsModels/newsAlert.model.js";
import productCategoryModel from "../../models/productCateogory.model.js";

export const createAlert = async (req, res) => {
  try {
    const { title, description, category, articleLink } = req.body;

    // Check if the category exists
    const categoryExists = await productCategoryModel.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found!" });
    }

    // Create a new news alert
    const newAlert = new NewsAlert({
      title,
      description,
      category,
      articleLink,
    });
    await newAlert.save();

    // Publish the alert to RabbitMQ

    // Emit the news alert to all connected clients
    // const io = req.app.get("io");
    // io.emit("news-update", newAlert);

    res.status(201).json({
      message: "News alert created successfully!",
      alert: newAlert,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating news alert", error });
  }
};

export default createAlert;
