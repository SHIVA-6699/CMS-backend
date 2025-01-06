import Permission from "../models/permission.model.js";

// Create a new permission
export const createPermission = async (req, res) => {
  const { name, description } = req.body;
  try {
    const existingPermission = await Permission.findOne({ name });
    if (existingPermission)
      return res.status(400).json({ message: "Permission already exists" });

    const newPermission = new Permission({ name, description });
    await newPermission.save();
    res
      .status(201)
      .json({ message: "Permission created successfully", newPermission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit an existing permission
export const editPermission = async (req, res) => {
  const {permissionId} = req.params;
  const { name, description } = req.body;
  try {
    const permission = await Permission.findById(permissionId);
    if (!permission)
      return res.status(404).json({ message: "Permission not found" });

    permission.name = name || permission.name;
    permission.description = description || permission.description;

    await permission.save();
    res
      .status(200)
      .json({ message: "Permission updated successfully", permission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a permission
export const deletePermission = async (req, res) => {
  const { permissionId } = req.params;
  try {
    const permission = await Permission.findByIdAndDelete(permissionId);
    if (!permission)
      return res.status(404).json({ message: "Permission not found" });

    res.status(200).json({ message: "Permission deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// View all permissions
export const viewPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json({ permissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
