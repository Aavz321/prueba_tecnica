import mongoose from "mongoose";
import { Schema } from "mongoose";
import "dotenv/config.js";
const uri = process.env.MONGO_URI;

// Conexión a la base de datos MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Definición del esquema para el modelo User
const User = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

// Creación del modelo Auth basado en el esquema User
const Auth = mongoose.model("User", User, "users");

export class AuthModel {
  // Método para registrar un nuevo usuario
  static async register({ input }) {
    const user = new Auth(input);
    const savedUser = await user.save();
    return {
      _id: savedUser._id,
      ...savedUser,
    };
  }

  // Método para encontrar un usuario por su nombre de usuario
  static async findUser({ input }) {
    const user = await Auth.findOne({ username: input });
    return user;
  }
}
