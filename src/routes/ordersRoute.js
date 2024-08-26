import { Router } from "express";
import { OrderController } from "../controllers/orderController.js";

export const createOrdersRouter = ({ orderModel }) => {
  const orderRouter = Router();

  const orderController = new OrderController({ orderModel });

  orderRouter
    .route("/orders")
    .post(orderController.createOrder)
    .all((req, res) => {
      res.status(405).json({ error: "Method Not Allowed" });
    });

  orderRouter
    .route("/orders/:orderId")
    .get(orderController.getOrderById)
    .patch(orderController.updateOrderStatus)
    .all((req, res) => {
      res.status(405).json({ error: "Method Not Allowed" });
    });

  orderRouter
    .route("/users/:userId/orders")
    .get(orderController.getOrdersByUser)
    .all((req, res) => {
      res.status(405).json({ error: "Method Not Allowed" });
    });

  return orderRouter;
};
