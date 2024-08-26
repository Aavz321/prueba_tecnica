import mongoose from "mongoose";
import z from "zod";

// Validación de datos
export const orderItemSchema = z.object({
  product_id: z
    .string({
      invalid_type_error: "Product ID must be a string",
      required_error: "Product ID is required",
    })
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid product_id format",
    }),
  quantity: z
    .number({
      invalid_type_error: "Quantity must be a number",
      required_error: "Quantity is required",
    })
    .min(1, "Quantity must be at least 1"),
});

// Función para validar de forma estricta
export const validateOrderItem = (input) => {
  return orderItemSchema.safeParse(input);
};

// Función para validar de forma parcial
export const validatePartialOrderItem = (input) => {
  return orderItemSchema.partial().safeParse(input);
};
