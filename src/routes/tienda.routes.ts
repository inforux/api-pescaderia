import Router from "express-promise-router";
import {
  createTienda,
  deleteTienda,
  getTienda,
  getTiendas,
  removeTienda,
  updateTienda,
} from "../controllers/tienda.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { validateSchema } from "../middlewares/validateSchema";
import { createTiendaSchema } from "../schemas/tienda.schema";

const router = Router();

router.get("/tiendas", requireAuth, getTiendas);

router.post("/tiendas", requireAuth, validateSchema(createTiendaSchema), createTienda);

router.get("/tiendas/:id", requireAuth, getTienda);

router.delete("/tiendas/:id", requireAuth, removeTienda);
router.delete("/deletetiendas/:id", requireAuth, deleteTienda);

router.patch("/tiendas/:id", requireAuth, updateTienda);

export default router;