import { validateUser } from "../schemas/userSchema.js";
import { LogModel } from "../models/mongodb/logMongodb.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

const salt = parseInt(process.env.SALT_ROUNDS);

export class AuthController {
  constructor({ authModel }) {
    this.authModel = authModel;
  }

  // Función de registro
  register = async (req, res) => {
    // Validación con zod

    const result = validateUser(req.body);

    // Manejo de error en validación
    if (result.error) {
      // Para usuarios finales se puede retornar JSON.parse(result.error.message)[0].message
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    // Cifrado de contraseña
    result.data.password = await bcrypt.hash(result.data.password, salt);

    // Manejo de error en model
    try {
      const user = await this.authModel.register({
        input: result.data,
      });
      res.status(201).json({
        message: "User registered successfully",
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: "Username already exists" });
      }
      res
        .status(500)
        .json({ error: "Internal Server Error. Please try again later." });
    }
  };

  // Función de login
  login = async (req, res) => {
    // Validación con zod
    const result = validateUser(req.body);
    // Manejo de error en validación
    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    // Manejo de error en model
    try {
      const user = await this.authModel.findUser({
        input: result.data.username,
      });
      if (!user) {
        return res.status(401).json({ error: "Username does not exist" });
      }

      const isValid = bcrypt.compareSync(result.data.password, user.password);
      if (!isValid) {
        await LogModel.createLog("LOGIN_ATTEMPT_FAILED", user._id, {
          reason: "Incorrect password",
        });
        return res.status(401).json({ error: "Incorrect password" });
      }

      await LogModel.createLog("LOGIN_SUCCESS", user._id, {});

      // Firma JWT
      const token = jwt.sign(
        {
          _id: user._id,
          username: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      // Seteo en cookie, lo vuelve menos vulnerable a XSS

      res
        .status(202)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV == "production",
          sameSite: "strict",
          maxAge: 1000 * 60 * 60,
        })
        .json({
          message: "User successfully logged in",
          userId: user._id,
        });
    } catch (error) {
      await LogModel.createLog("LOGIN_ERROR", "anonymous", {
        error: error.message,
      });
      res
        .status(500)
        .json({ error: "Internal Server Error. Please try again later." });
    }
  };

  logout = async (req, res) => {
    res.clearCookie("access_token").json({ message: "Logout succesful" });
  };
}
