import { Router } from "express";
import sessionsRouter from "./sessions.router.js";
import usersRouter from "./users.router.js";
import productsRouter from "./products.router.js";
import cartsRouter from "./carts.router.js";

const router = Router();

router.use("/sessions", sessionsRouter);
router.use("/users", usersRouter);
router.use("/products", productsRouter);
router.use("/carts", cartsRouter);

export default router;