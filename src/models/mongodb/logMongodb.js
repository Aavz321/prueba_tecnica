import mongoose from "mongoose";
import { Schema } from "mongoose";
import "dotenv/config.js";
const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const LogSchema = new Schema({
  action: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model("Log", LogSchema, "logs");

export class LogModel {
  static async createLog(action, userId, details) {
    const log = new Log({
      action,
      userId,
      details,
    });
    await log.save();
  }

  static async getLogs(filter = {}, limit = 100) {
    return Log.find(filter).sort({ timestamp: -1 }).limit(limit);
  }
}
