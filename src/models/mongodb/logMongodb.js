import mongoose from "mongoose";
import { Schema } from "mongoose";
import "dotenv/config.js";
const uri = process.env.MONGO_URI;

// Conexión a la base de datos MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Definición del esquema para el modelo Log
const LogSchema = new Schema({
  action: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now },
});

// Creación del modelo Log basado en el esquema Log
const Log = mongoose.model("Log", LogSchema, "logs");

export class LogModel {
  // Método para registrar un nuevo log
  static async createLog(action, userId, details) {
    const log = new Log({
      action,
      userId,
      details,
    });
    await log.save();
  }

  // Método para obtener los logs
  static async getLogs(filter = {}, limit = 100) {
    return Log.find(filter).sort({ timestamp: -1 }).limit(limit);
  }
}
