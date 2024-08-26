import z from "zod";
import { orderItemSchema } from "./orderItemSchema.js";
import mongoose from "mongoose";

const statusSchema = z.enum(["pendiente", "enviado", "completado"]);

// Validación de datos
const orderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, "order must include at least one item"),
  shipping_address: z.string({
    invalid_type_error: "Shipping address must be a string",
    required_error: "Shipping address is required",
  }),
  total: z
    .number({
      invalid_type_error: "total must be a number",
    })
    .optional(),
  status: statusSchema.optional(),
  creator_id: z
    .string({
      invalid_type_error: "creator_id must be a string",
      required_error: "creator_id is required",
    })
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid creator_id format",
    }),
});

// Función para validar de forma estricta
export const validateOrder = (input) => {
  return orderSchema.safeParse(input);
};

// Función para validar de forma parcial
export const validatePartialOrder = (input) => {
  return orderSchema.partial().safeParse(input);
};
