import { Router } from "express";
import passport from "passport";
import { authorize } from "../middlewares/authorization.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", getProducts);
router.get("/:pid", getProductById);

// Solo ADMIN puede crear / actualizar / eliminar
router.post("/", passport.authenticate("current", { session: false }), authorize("admin"), createProduct);
router.put("/:pid", passport.authenticate("current", { session: false }), authorize("admin"), updateProduct);
router.delete("/:pid", passport.authenticate("current", { session: false }), authorize("admin"), deleteProduct);

export default router;