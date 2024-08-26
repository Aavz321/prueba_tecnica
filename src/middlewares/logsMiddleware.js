import { LogModel } from "../models/mongodb/logMongodb.js";
import jwt from "jsonwebtoken";

// Middleware para la gestión de logs
export const loggingMiddleware = async (req, res, next) => {
  const originalJson = res.json;

  // Sobrescribe res.json para capturar el cuerpo de la respuesta
  res.json = function (body) {
    res.locals.body = body;
    originalJson.call(this, body);
  };

  // Cuando la respuesta se complete, registra el log
  res.on("finish", async () => {
    try {
      const token = req.cookies.access_token;
      let userId = "anonymous";
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded._id;
      }

      await LogModel.createLog(`${req.method} ${req.originalUrl}`, userId, {
        requestBody: req.body,
        responseBody: res.locals.body,
        statusCode: res.statusCode,
      });
    } catch (error) {
      return new Error("Error loggin activity");
    }
  });

  next();
};
