import bcrypt from "bcryptjs";
import Role from "../models/role.model.js";
import User from "../models/user.model.js";
import Permission from "../models/permission.model.js";
import UserCategory from "../models/userCategory.model.js"; // Import UserCategory model
import { config } from "../config/env.js";

export const initializeAdmin = async () => {
  try {
    // Step 1: Check if admin permissions exist and create them
    const adminPermissions = [
      // CRUD OPERTIONS FOR USER
      "create_role",
      "edit_role",
      "delete_role",
      "create_user",
      "edit_user",
      "delete_user",
      "assign_role_to_user",
      "add_permission_to_role",
      "remove_permission_from_role",
      "add_permission_to_user",
      "remove_permission_from_user",
      "view_audit_logs",
      "manage_system_settings",
      "initialize_admin",
      //  CRUD FOR USER CATEGORY
      "create_user_category",
      "edit_user_category",
      "delete_user_category",
      "view_user_category",
      // CRUD FOR PRODUCT CATEGORY
      "create_product_category",
      "edit_product_category",
      "delete_product_category",
      "view_product_category",
      // CRUD FOR CONTENT
      "create_content",
      "edit_content",
      "delete_content",
      // LIVE PERMSIOSNS
      "create_live",
    ];

    let permissionIds = [];
    for (const permissionName of adminPermissions) {
      let permission = await Permission.findOne({ name: permissionName });
      if (!permission) {
        permission = new Permission({
          name: permissionName,
          description: `Permission to ${permissionName.replace(/_/g, " ")}`,
        });
        await permission.save();
      }
      permissionIds.push(permission._id);
    }
    // Step 2: Check if the admin role exists and create it if not
    let adminRole = await Role.findOne({ name: "Admin" });
    if (!adminRole) {
      adminRole = new Role({
        name: "Admin",
        description: "Administrator role with full permissions",
        permissions: permissionIds,
      });
      await adminRole.save();
      console.log("Admin role created successfully");
    }

    // Step 3: Check if the "Admin" category exists and create it if not
    let adminCategory = await UserCategory.findOne({ name: "Admin" });
    if (!adminCategory) {
      adminCategory = new UserCategory({
        name: "Admin",
        description: "Default category for the admin user",
        createdBy: null, // No user created this category, as it's a system default
      });
      await adminCategory.save();
      console.log("Admin category created successfully");
    }

    // Step 4: Check if the admin user exists and create it if not
    const existingAdmin = await User.findOne({ email: config.adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(config.adminPassword, 12);
      const adminUser = new User({
        name: "Admin",
        email: config.adminEmail,
        password: hashedPassword,
        role:"Admin",
        roleId: adminRole._id,
        categoryId: adminCategory._id, // Assign the admin category
      });
      await adminUser.save();
      console.log("Admin user created successfully");
    } else {
      // Reassign admin role and category if missing or incorrect
      if (
        !existingAdmin.roleId ||
        !existingAdmin.roleId.equals(adminRole._id)
      ) {
        existingAdmin.roleId = adminRole._id;
      }
      if (
        !existingAdmin.categoryId ||
        !existingAdmin.categoryId.equals(adminCategory._id)
      ) {
        existingAdmin.categoryId = adminCategory._id;
      }
      await existingAdmin.save();
      console.log("Admin role and category reassigned to existing admin user");
    }
  } catch (error) {
    console.error("Error initializing admin:", error);
  }
};
