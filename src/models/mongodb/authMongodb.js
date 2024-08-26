import mongoose from "mongoose";
import { Schema } from "mongoose";
import "dotenv/config.js";
const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const User = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const Auth = mongoose.model("User", User, "users");

export class AuthModel {
  static async register({ input }) {
    const user = new Auth(input);
    const savedUser = await user.save();
    return {
      _id: savedUser._id,
      ...savedUser,
    };
  }

  static async findUser({ input }) {
    const user = await Auth.findOne({ username: input });
    return user;
  }
}
