import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";

const router = Router();

// Registro
router.post("/register", (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ status: "error", message: info?.message || "Register failed" });

    return res.status(201).json({ status: "success", message: "User created" });
  })(req, res, next);
});

// Login  
router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ status: "error", message: info?.message || "Unauthorized" });

    const token = generateToken({ id: user._id, role: user.role, email: user.email });

    res.cookie("access_token", token, {
      httpOnly: true,
      
      sameSite: "lax",
    });

    return res.json({ status: "success", token });
  })(req, res, next);
});


router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    return res.json({ status: "success", user: req.user });
  }
);

export default router;