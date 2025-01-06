import mongoose from "mongoose";

const newsAlertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 200,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // Reference to ProductCategory model
    ref: "ProductCategory", // Reference name must match the model name
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Auto-generated timestamp
  },
  articleLink: {
    type: String, // Optional: Link to the full article
  },
  isActive: {
    type: Boolean,
    default: true, // To show if the alert is still active
  },
});

const NewsAlert = mongoose.model("NewsAlert", newsAlertSchema);

export default NewsAlert;
