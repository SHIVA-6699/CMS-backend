import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the role (e.g., Marketing Staff)
  description: { type: String }, // Description of the role
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }], // Array of Permission IDs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
