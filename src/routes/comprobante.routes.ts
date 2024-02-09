import Router from "express-promise-router";
import {
  createComprobante,
  deleteComprobante,
  getComprobante,
  getComprobantes,
  removeComprobante,
  updateComprobante,
} from "../controllers/comprobante.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { validateSchema } from "../middlewares/validateSchema";
import { createComprobanteSchema } from "../schemas/comprobante.schema";

const router = Router();

router.get("/comprobantes", requireAuth, getComprobantes);

router.post("/comprobantes", requireAuth, validateSchema(createComprobanteSchema), createComprobante);

router.get("/comprobantes/:id", requireAuth, getComprobante);

router.delete("/comprobantes/:id", requireAuth, removeComprobante);
router.delete("/deletecomprobantes/:id", requireAuth, deleteComprobante);

router.patch("/comprobantes/:id", requireAuth, updateComprobante);

export default router;