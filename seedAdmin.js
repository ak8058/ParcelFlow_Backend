import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";
dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASS;
    const name = process.env.ADMIN_NAME;
    let admin = await User.findOne({ email });
    if (admin) {
      console.log("Admin Already Exist IN Database");
    } else {
      admin = await new User({
        name,
        email,
        password,
      });
      await admin.save();
      console.log("Admin Created");
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error Sedding Admin User:", error);
    process.exit(1);
  }
};

seedAdmin();
