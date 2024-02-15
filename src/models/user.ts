import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the shape of the User document in MongoDB
export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  resetToken?: string;
  resetTokenExpiration?: number;
};

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiration: { type: Number },
});

// Middleware to hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Create the User model using the schema
const User = mongoose.model<UserType>("User", userSchema);

export default User;
