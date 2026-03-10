import { Router } from "express";
import passport from "passport";
import { authorize } from "../middlewares/authorization.js";
import { getCartById, addProductToCart, purchaseCart } from "../controllers/carts.controller.js";

const router = Router();

// Ver carrito (logueado)
router.get("/:cid", passport.authenticate("current", { session: false }), getCartById);

// Solo USER puede agregar productos al carrito
router.post(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  authorize("user"),
  addProductToCart
);

// Comprar carrito (logueado)
router.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  purchaseCart
);

export default router;