import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import productsRoutes from "./routes/producto.routes";
import clientsRoutes from "./routes/clients.routes";
import roleRoutes from "./routes/roles.routes";
import sistemaRoutes from "./routes/sistema.routes";
import tiendaRoutes from "./routes/tienda.routes";
import formasPagoRoutes from "./routes/formaPago.routes";
import comprobanteRoutes from "./routes/comprobante.routes";
import unidadRoutes from "./routes/unidadMedida.routes";
import salidadRoutes from "./routes/salidas.routes"
import {createRoles} from './libs/createboot'

const app = express();
createRoles()

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/system", sistemaRoutes)
app.use("/api/store", tiendaRoutes)
app.use("/api/fp", formasPagoRoutes)
app.use("/api/comprobante", comprobanteRoutes)
app.use("/api/um", unidadRoutes)
app.use("/api/out", salidadRoutes)

app.use((req, res, next) => {
  const error = new Error("Not found");
  next(error);
});

app.use((err:any, req:any, res:any, next:any) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(status).json([
    {
      message,
    },
  ]);
});

export default app;