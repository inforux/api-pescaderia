import Router from "express-promise-router";
import { requireAuth } from "../middlewares/requireAuth";
import { validateSchema } from "../middlewares/validateSchema";
import { anularSalida, createSalida, deleteSalida, get5TopProductByDay, getHistoricoDeVentas, getSalida, getSalidas, getStock10Top } from "../controllers/salidas.controller";
import { createSalidaSchema } from "../schemas/salida.schema";

const router = Router();

router.get("/salidas", requireAuth, getSalidas);

router.get("/salidas/historico", requireAuth, getHistoricoDeVentas);
router.get("/salidas/historico5top", requireAuth, get5TopProductByDay);
router.get("/salidas/stock10", requireAuth, getStock10Top);

router.post("/salidas", requireAuth, validateSchema(createSalidaSchema), createSalida);

router.get("/salidas/:id", requireAuth, getSalida);

router.delete("/salidas/:id", requireAuth, deleteSalida);

router.put("/salidas/:id", requireAuth, anularSalida );

export default router;