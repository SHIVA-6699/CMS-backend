import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";
import bcrypt from "bcryptjs";
import mongoose, { Types } from "mongoose";
import UserCategory from "../models/userCategory.model.js";
// 1. Create User
export const createUser = async (req, res) => {
  const { name, email, password, roleId, categoryId } = req.body;

  try {
    // Check if the role exists
    const role = await Role.findById(roleId);
    if (!role) return res.status(404).json({ message: "Role not found" });

    // Check if the user category exists
    const userCategory = await UserCategory.findById(categoryId);
    if (!userCategory)
      return res.status(404).json({ message: "User category not found" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      roleId,
      role:"cms_user",
      categoryId, // Reference to UserCategory
    });

    // Save the user
    await newUser.save();

    // Add the user to the category's users list
    userCategory.users.push(newUser._id);
    await userCategory.save();

    // Remove sensitive data from the response
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res
      .status(201)
      .json({
        message: "User created successfully",
        user: userWithoutPassword,
      });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// 2. Assign Role to User
export const assignRoleToUser = async (req, res) => {
  const { userId, roleId } = req.body;
  try {
    const user = await User.findById(userId);
    const role = await Role.findById(roleId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!role) return res.status(404).json({ message: "Role not found" });

    user.roleId = roleId;
    await user.save();

    res.status(200).json({ message: "Role assigned to user", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. Remove Role from User
export const removeRoleFromUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.roleId = null; // Remove the role
    
    await user.save();

    res.status(200).json({ message: "Role removed from user", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 4. Assign Permissions to User
export const assignPermissionToUser = async (req, res) => {
  const { userId, permissionIds } = req.body; // permissionIds is now an array
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch all permissions based on the permissionIds array
    const permissions = await Permission.find({
      _id: { $in: permissionIds },
    });

    if (permissions.length !== permissionIds.length) {
      return res
        .status(404)
        .json({ message: "One or more permissions not found" });
    }

    // Check if the user already has the permissions and add any missing ones
    const existingPermissions = user.permissions.map((permId) =>
      permId.toString()
    );
    const newPermissions = permissionIds.filter(
      (permId) => !existingPermissions.includes(permId)
    );

    if (newPermissions.length > 0) {
      user.permissions.push(...newPermissions);
      await user.save();
    }

    res.status(200).json({ message: "Permissions assigned to user", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};















// 5. Remove Permissions from User
export const removePermissionFromUser = async (req, res) => {
  const { userId, permissionId } = req.body;

  console.log("User ID:", userId);
  console.log("Permission IDs:", permissionId); // This should be an array of permission IDs

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Convert permissionId (which might be an array) to ObjectIds
    const permissionObjectIds = permissionId.map((id) =>
     new mongoose.Types.ObjectId(id)
    );

    // Remove each permission from the user's permissions array
    user.permissions = user.permissions.filter(
      (permId) => !permissionObjectIds.some((id) => permId.equals(id))
    );

    // Save the updated user
    await user.save();

    // Return the response with the updated user
    res.status(200).json({ message: "Permission(s) removed from user", user });
  } catch (err) {
    console.error(err); // Log any errors for debugging
    res.status(500).json({ message: "Server error" });
  }
};
















// 6. Delete User
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 7. View All Users
export const viewUsers = async (req, res) => {
  try {
    const users = await User.find().populate("roleId"); // Populate roleId to get role details
    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 8. Edit User
export const editUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, roleId, categoryId } = req.body;

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields if they are provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      // Hash the password before updating
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
    }
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) return res.status(404).json({ message: "Role not found" });
      user.roleId = roleId;
    }
    if (categoryId) {
      const newCategory = await UserCategory.findById(categoryId);
      if (!newCategory)
        return res.status(404).json({ message: "User category not found" });

      // Remove the user from the previous category (if applicable)
      if (user.categoryId && user.categoryId.toString() !== categoryId) {
        const oldCategory = await UserCategory.findById(user.categoryId);
        if (oldCategory) {
          oldCategory.users = oldCategory.users.filter(
            (userId) => userId.toString() !== user._id.toString()
          );
          await oldCategory.save();
        }

        // Add the user to the new category
        newCategory.users.push(user._id);
        await newCategory.save();
      }

      user.categoryId = categoryId; // Update the categoryId
    }

    // Save the updated user
    await user.save();

    // Remove sensitive data from the response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res
      .status(200)
      .json({
        message: "User updated successfully",
        user: userWithoutPassword,
      });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// 9. Get permissions for a specific user
export const getUserPermissions = async (req, res) => {
  const { userId } = req.params;  // User ID from request params

  try {
    const user = await User.findById(userId).populate('permissions');  // Populate the 'permissions' field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the permissions of the user as a response
    res.status(200).json({ permissions: user.permissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};