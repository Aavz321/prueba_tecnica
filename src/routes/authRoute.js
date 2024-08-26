import { Router } from "express";
import { AuthController } from "../controllers/authController.js";

export const createAuthRouter = ({ authModel }) => {
  const authRouter = Router();

  const authController = new AuthController({ authModel });

  authRouter
    .route("/register")
    .post(authController.register)
    .all((req, res) => {
      res.status(405).json({ error: "Method Not Allowed" });
    });

  authRouter
    .route("/login")
    .post(authController.login)
    .all((req, res) => {
      res.status(405).json({ error: "Method Not Allowed" });
    });

  authRouter
    .route("/logout")
    .post(authController.logout)
    .all((req, res) => {
      res.status(405).json({ error: "Method Not Allowed" });
    });

  return authRouter;
};
