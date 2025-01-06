import AuditLog from "../models/auditlog.model.js";
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("user", "name email") // Populate user details
      .sort({ timestamp: -1 }); // Sort by most recent first

    res.status(200).json(logs);
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    res.status(500).json({ message: "Server error" });
  }
};
