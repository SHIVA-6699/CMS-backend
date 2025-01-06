import AuditLog from "../models/auditlog.model.js";

// Get all audit logs (with optional filters)
export const getAuditLogs = async (req, res) => {
  const { user, action, resource, startDate, endDate } = req.query;

  const filters = {};
  if (user) filters.user = user;
  if (action) filters.action = action;
  if (resource) filters.resource = resource;
  if (startDate || endDate) {
    filters.timestamp = {};
    if (startDate) filters.timestamp.$gte = new Date(startDate);
    if (endDate) filters.timestamp.$lte = new Date(endDate);
  }

  try {
    const logs = await AuditLog.find(filters)
      .populate("user", "name email") // Include user info
      .sort({ timestamp: -1 });

    res.status(200).json({ logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
