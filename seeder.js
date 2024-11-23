import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import { connectDb } from "./config/db.js";
import { hashPassword } from "./middleware/authHelper.js";

dotenv.config();

connectDb();

const seedUsers = async () => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: process.env.AdminEmail });

    if (existingUser) {
      console.log("User with this email already exists");
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(process.env.AdminPass);

    // Create a new user
    const user = new User({
      name: process.env.AdminName,
      email: process.env.AdminEmail,
      password: hashedPassword,
      role: 1, // Admin role
    });

    // Save the user to the database
    await user.save();
    console.log("User created successfully");
  } catch (error) {
    console.error("Error seeding users:", error.message);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

seedUsers();
