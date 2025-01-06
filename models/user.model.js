import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Hashed passwordp
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
    },
  ],
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCategory",
    required: true,
  },
  role:{type:String},
  otp: { type: String }, // One-Time Password for authentication (optional)
  otpExpiry: { type: Date }, // Expiry time for the OTP
  resetToken: { type: String }, // Token for password reset
  resetTokenExpiry: { type: Date }, // Expiry time for reset token
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;