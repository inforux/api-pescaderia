import Router from "express-promise-router";
import {
  deleteUser,
  getUser,
  getUsers,
  loginHandler,
  profileHandler,
  removeUser,
  signupHandler,
  updateUser,
} from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { validateSchema } from "../middlewares/validateSchema";
import { loginSchema, signupSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", validateSchema(signupSchema), signupHandler);

router.post("/login", validateSchema(loginSchema), loginHandler);

router.get("/profile", requireAuth, profileHandler);

router.get("/users", requireAuth, getUsers);

router.get("/users/:id", requireAuth, getUser);

router.delete("/users/:id", requireAuth, removeUser);

router.delete("/deleteusers/:id", requireAuth, deleteUser);

router.patch("/users/:id", requireAuth, updateUser);

export default router;