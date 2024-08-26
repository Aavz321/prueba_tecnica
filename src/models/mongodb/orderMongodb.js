import mongoose, { Schema } from "mongoose";
import "dotenv/config.js";
const uri = process.env.MONGO_URI;

// Conexión a la base de datos MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Definición de esquemas
const ProductSchema = new Schema({
  brand: { type: String },
  name: { type: String },
  unit_price: { type: Number },
});

const OrderItemSchema = new Schema({
  product_id: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema({
  items: [OrderItemSchema],
  shipping_address: { type: String, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pendiente", "enviado", "completado"],
    default: "pendiente",
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

// Creación de modelos
const Product = mongoose.model("Product", ProductSchema, "products");

const Order = mongoose.model("Order", OrderSchema, "orders");

export class OrderModel {
  // Método para crear orden
  static async createOrder({ input }) {
    const order = new Order(input);
    const items = input.items;

    // Obtener product_id de productos
    const productIds = items.map((item) => item.product_id);

    // Verificar si todos los product_ids existen en la colección products
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = new Map(
      products.map((product) => [product._id.toString(), product.unit_price])
    );

    // Verificar si todos los product_ids del pedido están en la lista de productos válidos
    const allProductsValid = items.every((item) =>
      productMap.has(item.product_id)
    );

    if (!allProductsValid) {
      throw new Error("One or more products do not exist");
    }

    // Calcular el total del pedido
    const total = items.reduce((acumulador, item) => {
      const unitPrice = productMap.get(item.product_id);
      return acumulador + unitPrice * item.quantity;
    }, 0);

    // Establecer el total calculado en el pedido
    order.total = total;

    const savedOrder = await order.save();

    return savedOrder;
  }

  // Método para obtener orden por Id
  static async getOrderById(orderId) {
    const order = await Order.findById(orderId);

    return {
      _id: order._id,
      items: order.items,
      shipping_address: order.shipping_address,
      status: order.status,
      total: order.total,
      creator_id: order.creator_id,
    };
  }

  // Método para obtener orden por usuario
  static async getOrdersByUser(userId, status = "", page = 1, limit = 10) {
    // Validar la paginación
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    if (isNaN(pageNumber) || pageNumber < 1) {
      throw new Error("Invalid page number");
    }
    if (isNaN(pageSize) || pageSize < 1) {
      throw new Error("Invalid page size");
    }

    // Construir el filtro
    const filter = { creator_id: userId };

    if (status) {
      filter.status = status;
    }

    // Obtener pedidos con paginación
    const orders = await Order.find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    // Obtener el total de pedidos para proporcionar la paginación completa
    const totalOrders = await Order.countDocuments(filter);

    return {
      orders,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(totalOrders / pageSize),
      totalOrders,
    };
  }

  // Método para actualizar el estado de una orden dependiendo del rol
  static async updateOrderStatus(orderId, newStatus) {
    // Validar el estado
    const validStatuses = ["pendiente", "enviado", "completado"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid status value");
    }

    // Actualizar el estado de la orden
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true } // Para devolver el documento actualizado
    );

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    // Devolver el documento actualizado
    return {
      _id: updatedOrder._id,
      items: updatedOrder.items,
      shipping_address: updatedOrder.shipping_address,
      status: updatedOrder.status,
      total: updatedOrder.total,
      creator_id: updatedOrder.creator_id,
    };
  }
}
