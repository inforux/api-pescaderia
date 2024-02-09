import Router from "express-promise-router";
import {
  createUnidad,
  deleteUnidad,
  getUnidad,
  getUnidades,
  removeUnidad,
  updateUnidad,
} from "../controllers/unidadMedida.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { validateSchema } from "../middlewares/validateSchema";
import { createUnidadSchema } from "../schemas/unidad.schema";

const router = Router();

router.get("/unidades", requireAuth, getUnidades);

router.post("/unidades", requireAuth, validateSchema(createUnidadSchema), createUnidad);

router.get("/unidades/:id", requireAuth, getUnidad);

router.delete("/unidades/:id", requireAuth, removeUnidad);
router.delete("/deleteunidades/:id", requireAuth, deleteUnidad);

router.patch("/unidades/:id", requireAuth, updateUnidad);

export default router;