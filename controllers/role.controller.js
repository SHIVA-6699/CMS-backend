import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";

// Create a new role
export const createRole = async (req, res) => {
  console.log(req.body.name);
  const { name, description, permissions } = req.body;


  try {
    const existingRole = await Role.findOne({ name });
    if (existingRole)
      return res.status(400).json({ message: "Role already exists" });

    const validPermissions = await Permission.find({
      _id: { $in: permissions },
    });

    const newRole = new Role({
      name,
      description,
      permissions: validPermissions.map((p) => p._id),
    });

    await newRole.save();
    res.status(201).json({ message: "Role created successfully", newRole });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit an existing role
export const editRole = async (req, res) => {
  const { roleId } = req.params;
  const { name, description, permissions } = req.body;
  try {
    const role = await Role.findById(roleId);
    if (!role) return res.status(404).json({ message: "Role not found" });

    role.name = name || role.name;
    role.description = description || role.description;

    if (permissions) {
      const validPermissions = await Permission.find({
        _id: { $in: permissions },
      });
      role.permissions = validPermissions.map((p) => p._id);
    }

    await role.save();
    res.status(200).json({ message: "Role updated successfully", role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a role
export const deleteRole = async (req, res) => {
  const { roleId } = req.params;
  try {
    const role = await Role.findByIdAndDelete(roleId);
    if (!role) return res.status(404).json({ message: "Role not found" });

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Assign permission to role
export const addPermissionToRole = async (req, res) => {
  const { roleId } = req.params; // Extract roleId from URL params
  const { permissions } = req.body; // Extract permissions array from the body

  try {
    const role = await Role.findById(roleId);

    if (!role) return res.status(404).json({ message: "Role not found" });

    // Validate each permission and add it if not already present
    for (const permissionId of permissions) {
      const permission = await Permission.findById(permissionId);

      if (!permission) {
        return res
          .status(404)
          .json({ message: `Permission not found: ${permissionId}` });
      }

      if (!role.permissions.includes(permissionId)) {
        role.permissions.push(permissionId);
      }
    }

    await role.save();

    res.status(200).json({ message: "Permissions added to role", role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove permission from role
export const removePermissionFromRole = async (req, res) => {
  const { roleId } = req.params;
  const { permissions } = req.body;

  try {
    const role = await Role.findById(roleId);
    if (!role) return res.status(404).json({ message: "Role not found" });

    // Remove each permission from the role's permissions array
    role.permissions = role.permissions.filter(
      (permId) => !permissions.includes(permId.toString())
    );

    await role.save();

    res.status(200).json({ message: "Permissions removed from role", role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// View all roles
export const viewRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions");
    res.status(200).json({ roles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all permissions for a specific role
export const getPermissionsForRole = async (req, res) => {
  const { roleId } = req.params; // Extract the roleId from URL parameters

  try {
    const role = await Role.findById(roleId).populate("permissions");

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({ permissions: role.permissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
