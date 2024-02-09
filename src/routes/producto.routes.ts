import Router from "express-promise-router";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  removeProduct,
  updateProduct,
} from "../controllers/products.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { validateSchema } from "../middlewares/validateSchema";
import { createProductSchema } from "../schemas/product.schema";

const router = Router();

router.get("/products", requireAuth, getProducts);

router.post("/products", requireAuth, validateSchema(createProductSchema), createProduct);

router.get("/products/:id", requireAuth, getProduct);

router.delete("/products/:id", requireAuth, removeProduct);
router.delete("/deleteproducts/:id", requireAuth, deleteProduct);

router.patch("/products/:id", requireAuth, updateProduct);

export default router;