// Import mongoose
import mongoose from "mongoose";

// Define the Content Schema
const ContentSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategory",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  subDescription: {
    type: String,
  },
  image: {
    type: String, // URL to the image
  },
  externalLink: {
    type: String, // URL to an external resource
  },
  youtubeVideoLink: {
    type: String, // URL to a YouTube video
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the updatedAt field before saving
ContentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Content model
const Content = mongoose.model("Content", ContentSchema);

export default Content;
