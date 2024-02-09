import Router from "express-promise-router";
import {
  createClient,
  deleteClient,
  getClient,
  getClients,
  removeClient,
  updateClient,
} from "../controllers/clients.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { validateSchema } from "../middlewares/validateSchema";
import { createClientSchema } from "../schemas/client.schema";

const router = Router();

router.get("/clients", requireAuth, getClients);

router.post("/clients", requireAuth, validateSchema(createClientSchema), createClient);

router.get("/clients/:id", requireAuth, getClient);

router.delete("/clients/:id", requireAuth, removeClient);
router.delete("/deleteclients/:id", requireAuth, deleteClient);

router.patch("/clients/:id", requireAuth, updateClient);

export default router;