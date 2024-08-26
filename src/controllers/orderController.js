import { validateOrder, validatePartialOrder } from "../schemas/orderSchema.js";
import { validateOrderItem } from "../schemas/orderItemSchema.js";

import jwt from "jsonwebtoken";
import "dotenv/config.js";

export class OrderController {
  constructor({ orderModel }) {
    this.orderModel = orderModel;
  }

  createOrder = async (req, res) => {
    //usuario admitido
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(403).json({ error: "Access not authorized" });
    }

    // Validación con zod
    const { items, shipping_address } = req.body;

    const data = jwt.verify(token, process.env.JWT_SECRET);

    const result = validateOrder({
      items,
      shipping_address,
      status: "pendiente",
      creator_id: data._id,
    });

    // Manejo de error en validación
    if (result.error) {
      // Para usuarios finales se puede retornar JSON.parse(result.error.message)[0].message
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    try {
      const order = await this.orderModel.createOrder({
        input: result.data,
      });

      res.status(201).json({
        message: "Order created successfully",
        orderId: order._id,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal Server Error. Please try again later." });
    }
  };

  getOrderById = async (req, res) => {
    // Obtener param
    const { orderId } = req.params;

    //usuario admitido
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(403).json({ error: "Access not authorized" });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);

    try {
      const order = await this.orderModel.getOrderById(orderId);

      if (order.creator_id != data._id) {
        return res.status(403).json({ error: "Access not authorized" });
      }

      res.json({ order });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal Server Error. Please try again later." });
    }
  };

  getOrdersByUser = async (req, res) => {
    const { userId } = req.params;
    const { status, page, limit } = req.query;

    try {
      const result = await this.orderModel.getOrdersByUser(
        userId,
        status,
        page,
        limit
      );
      res.json(result);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal Server Error. Please try again later." });
    }
  };

  updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;

    const token = req.cookies.access_token;
    if (!token) {
      return res.status(403).json({ error: "Access not authorized" });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);

    if (data.role != "admin") {
      return res
        .status(403)
        .json({ error: "Access not authorized, you are not an admin" });
    }

    const result = validatePartialOrder(req.body);

    try {
      const order = await this.orderModel.updateOrderStatus(
        orderId,
        result.data.status
      );
      res.json(order);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal Server Error. Please try again later." });
    }
  };
}
