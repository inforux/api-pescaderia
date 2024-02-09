import Router from "express-promise-router";
import {
  getSistema,
  updateSistema,
} from "../controllers/sistema.controller";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/sistema", requireAuth, getSistema);

router.patch("/sistema", requireAuth, updateSistema);

export default router;