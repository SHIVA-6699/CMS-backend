// middleware/auditLogger.js
import AuditLog from "../models/auditlog.model.js";

const auditLogger = async (req, res, next) => {
  // Store the original `res.json` method
  const originalJson = res.json;

  res.json = async function (body) {
    // Check if logging is necessary based on the request method and endpoint
    const loggableActions = ["POST", "PUT", "DELETE"]; // Log only these actions
    if (loggableActions.includes(req.method)) {
      try {
        // Determine the action type
        let action;
        if (req.method === "POST") action = "CREATE";
        if (req.method === "PUT") action = "UPDATE";
        if (req.method === "DELETE") action = "DELETE";

        // Extract resource and ID (if available)
        const resource = req.baseUrl.split("/").pop(); // e.g., 'content'
        const resourceId = req.params.id || body?.id || null; // ID of the resource

        // Log the action to the database
        await AuditLog.create({
          user: req.user?.userId || "Anonymous", // `req.user` should be set after authentication
          action,
          resource: resource.charAt(0).toUpperCase() + resource.slice(1), // Capitalize resource name
          resourceId,
          details: {
            url: req.originalUrl,
            method: req.method,
            body: req.body,
          },
        });
      } catch (error) {
        console.error("Error logging audit action:", error);
      }
    }

    // Call the original `res.json` to send the response
    return originalJson.apply(this, arguments);
  };

  next();
};

export default auditLogger;
