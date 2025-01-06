import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the permission (e.g., View Sales Data)
  description: { type: String }, // Detailed explanation of what this permission allows
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;
  