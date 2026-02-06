import { Router } from "express";
import sessionsRouter from "./sessions.router.js";
import usersRouter from "./users.router.js";

const router = Router();

router.use("/sessions", sessionsRouter);
router.use("/users", usersRouter);

export default router;