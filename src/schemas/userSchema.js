import z from "zod";

// Validación de datos

const roleSchema = z.enum(["user", "admin"]);

const userSchema = z.object({
  username: z
    .string({
      invalid_type_error: "Username must be a string",
      required_error: "Username is required",
    })
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be less than 30 characters"),
  password: z.string({
    invalid_type_error: "Password must be a string",
    required_error: "Password is required",
  }),
  //Opcional: usar enum o string y opcional porque se establecerá por defecto como user
  role: roleSchema.optional(),
});

// Función para validar de forma estricta
export const validateUser = (input) => {
  return userSchema.safeParse(input);
};

// Función para validar de forma parcial
export const validatePartialUser = (input) => {
  return userSchema.partial().safeParse(input);
};
