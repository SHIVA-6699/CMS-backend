import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  action: {
    type: String,
    required: true, // CREATE, UPDATE, DELETE
  },
  resource: {
    type: String,
    required: true, // Name of the resource (e.g., Content, User, Category)
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId, // Optional: ID of the resource
    required: false,
  },
  details: {
    type: Object, // Additional details about the action (e.g., body, URL, method)
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
