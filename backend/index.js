import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import usuarioRoutes from "./routes/usuarioRoutes.js";
import rolRoutes from "./routes/rolRoutes.js";
import cuentaBancariaRoutes from "./routes/cuentaBancariaRoutes.js";
import conciliacionRoutes from "./routes/conciliacionRoutes.js";
import auditorRoutes from "./routes/auditorRoutes.js";
import directorRoutes from "./routes/directorRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import estadoRoutes from "./routes/estadoRoutes.js";  // 🔹 Agregado
import movimientoCuentaRoutes from "./routes/movimientoCuentaRoutes.js";  // 🔹 Agregado
import libroMayorRoutes from "./routes/libroMayorRoutes.js";  // 🔹 Agregado
import chatbotRoutes from "./routes/chatbotRoutes.js"; // 🔹 Agregado

dotenv.config(); // 🔹 Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000; // 🔹 Definir puerto por defecto

app.use(cors());
app.use(express.json());

// ✅ Rutas del backend
app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/roles", rolRoutes);
app.use("/cuentas", cuentaBancariaRoutes);
app.use("/conciliaciones", conciliacionRoutes);
app.use("/auditor", auditorRoutes);
app.use("/director", directorRoutes);
app.use("/estados", estadoRoutes);  // 🔹 Agregado
app.use("/movimiento-cuenta", movimientoCuentaRoutes);  // 🔹 Agregado
app.use("/libro-mayor", libroMayorRoutes);  // 🔹 Agregado
app.use("/chatbot", chatbotRoutes); // 🔹 Agregado

// ✅ Middleware para manejar errores globales
app.use((err, req, res, next) => {
  console.error("Error detectado:", err.message);
  res.status(500).json({ error: "Error interno del servidor" });
});

// ✅ Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
