import cors from "cors";

// Gestión de cors, rutas admitidas
const ACCEPTED_ORIGINS = ["http://localhost:8080", "http://localhost:1234"];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      // Permite la solicitud si el origen es válido o no hay origen (para casos como Postman)
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }
      // Bloquea la solicitud si el origen no está permitido
      return callback(new Error("Not allowed by CORS"));
    },
  });
