import { Router } from "express";
import passport from "passport";
import User from "../models/user.model.js";
import { createHash } from "../utils/hash.js";
import { authorize } from "../middlewares/authorization.js";

const router = Router();


router.get(
  "/",
  passport.authenticate("current", { session: false }),
  authorize("admin"),
  async (req, res, next) => {
    try {
      const users = await User.find().select("-password").lean();
      res.json({ status: "success", users });
    } catch (err) {
      next(err);
    }
  }
);


router.get(
  "/:uid",
  passport.authenticate("current", { session: false }),
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.uid).select("-password").lean();
      if (!user) return res.status(404).json({ status: "error", message: "User not found" });
      res.json({ status: "success", user });
    } catch (err) {
      next(err);
    }
  }
);


router.post(
  "/",
  passport.authenticate("current", { session: false }),
  authorize("admin"),
  async (req, res, next) => {
    try {
      const { first_name, last_name, email, age, password, role } = req.body;

      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ status: "error", message: "Email already exists" });

      const user = await User.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        role: role || "user",
      });

      res.status(201).json({ status: "success", user: { ...user.toObject(), password: undefined } });
    } catch (err) {
      next(err);
    }
  }
);


router.put(
  "/:uid",
  passport.authenticate("current", { session: false }),
  async (req, res, next) => {
    try {
      const payload = { ...req.body };
      if (req.user.role !== "admin") delete payload.role;
      if (payload.password) payload.password = createHash(payload.password);

      const updated = await User.findByIdAndUpdate(req.params.uid, payload, { new: true })
        .select("-password")
        .lean();

      if (!updated) return res.status(404).json({ status: "error", message: "User not found" });
      res.json({ status: "success", user: updated });
    } catch (err) {
      next(err);
    }
  }
);


router.delete(
  "/:uid",
  passport.authenticate("current", { session: false }),
  authorize("admin"),
  async (req, res, next) => {
    try {
      const deleted = await User.findByIdAndDelete(req.params.uid).lean();
      if (!deleted) return res.status(404).json({ status: "error", message: "User not found" });

      res.json({ status: "success", message: "User deleted" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
