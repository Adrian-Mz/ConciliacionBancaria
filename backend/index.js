import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import usuarioRoutes from "./routes/usuarioRoutes.js";
import rolRoutes from "./routes/rolRoutes.js";
import cuentaBancariaRoutes from "./routes/cuentaBancariaRoutes.js";
import transaccionRoutes from "./routes/transaccionRoutes.js";
import reporteRoutes from "./routes/reporteRoutes.js";
import conciliacionRoutes from "./routes/conciliacionRoutes.js";
import auditorRoutes from "./routes/auditorRoutes.js";
import directorRoutes from "./routes/directorRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/roles", rolRoutes);
app.use("/cuentas", cuentaBancariaRoutes);
app.use("/transacciones", transaccionRoutes);
app.use("/reportes", reporteRoutes);
app.use("/conciliaciones", conciliacionRoutes);
app.use("/auditor", auditorRoutes);
app.use("/director", directorRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});