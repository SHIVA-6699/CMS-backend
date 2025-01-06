import User from "../models/user.model.js";

export const authorize = (allowedRoles) => async (req, res, next) => {
  try {
    // Fetch the user's role and permissions
    const user = await User.findById(req.user.userId).populate({
      path: "roleId",
      populate: {
        path: "permissions", // Populate permissions
        model: "Permission",
      },
    }).populate("permissions");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Extract user's role name and permissions
    const userRole = user.roleId.name;
      const rolePermissions = user.roleId.permissions.map((perm) => perm.name);
      const userPermissions = user.permissions.map((perm) => perm.name);
    

    // Check if user has the required role or permission
    const isAuthorized =
      allowedRoles.some((role) => userRole === role) || // Role-based access
      allowedRoles.some((perm) => rolePermissions.includes(perm)) || // Permission via role
      allowedRoles.some((perm) => userPermissions.includes(perm));// Permission-based access

    if (!isAuthorized) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    next(); // Proceed if authorized
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
