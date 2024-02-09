import Router from "express-promise-router";
import {
  createRole,
  deleteRole,
  getRole,
  getRoles,
  removeRole,
  updateRole,
} from "../controllers/roles.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { validateSchema } from "../middlewares/validateSchema";
import { createRoleSchema } from "../schemas/role.schema";

const router = Router();

router.get("/roles", requireAuth, getRoles);

router.post("/roles", requireAuth, validateSchema(createRoleSchema), createRole);

router.get("/roles/:id", requireAuth, getRole);

router.delete("/roles/:id", requireAuth, removeRole);

router.delete("/deleteroles/:id", requireAuth, deleteRole);

router.patch("/roles/:id", requireAuth, updateRole);

export default router;