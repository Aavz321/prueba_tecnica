import express, { json } from "express";
import { corsMiddleware } from "./src/middlewares/cors.js";
import { loggingMiddleware } from "./src/middlewares/logsMiddleware.js";
import { createOrdersRouter } from "./src/routes/ordersRoute.js";
import { createAuthRouter } from "./src/routes/authRoute.js";
import "dotenv/config.js";
import cookieParser from "cookie-parser";

export const createApp = ({ orderModel, authModel }) => {
  const app = express();
  app.use(json());
  app.use(corsMiddleware());
  app.use(cookieParser());
  app.use(loggingMiddleware);
  app.disable("x-powered-by");

  // Middleware para soporte de json inválidos
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({ error: "Invalid JSON format" });
    }
    next();
  });

  app.use("/auth", createAuthRouter({ authModel }));
  app.use("/api", createOrdersRouter({ orderModel }));

  const PORT = process.env.PORT ?? 1234;

  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
  });

  //Para test deshabilitar listen y port
  //return app;
};
