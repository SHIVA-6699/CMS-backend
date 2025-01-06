import mongoose from "mongoose";
const ProductCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const productCategoryModel = mongoose.model("ProductCategory", ProductCategorySchema);
export default productCategoryModel;
