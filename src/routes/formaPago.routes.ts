import Router from "express-promise-router";
import {
  createFormaPago,
  deleteFormaPago,
  getFormaPago,
  getFormaPagos,
  removeFormaPago,
  updateFormaPago,
} from "../controllers/formaPago.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { validateSchema } from "../middlewares/validateSchema";
import { createFormaPagoSchema } from "../schemas/formaPago.schema";

const router = Router();

router.get("/formaspago", requireAuth, getFormaPagos);

router.post("/formaspago", requireAuth, validateSchema(createFormaPagoSchema), createFormaPago);

router.get("/formaspago/:id", requireAuth, getFormaPago);

router.delete("/formaspago/:id", requireAuth, removeFormaPago);
router.delete("/deleteformaspago/:id", requireAuth, deleteFormaPago);

router.patch("/formaspago/:id", requireAuth, updateFormaPago);

export default router;