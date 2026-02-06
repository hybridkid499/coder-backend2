import { Router } from "express";
import passport from "passport";
import { UserModel } from "../models/user.model.js";
import { createHash } from "../utils/hash.js";
import { authorizeRoles } from "../utils/auth.js";

const router = Router();


router.get(
  "/",
  passport.authenticate("current", { session: false }),
  authorizeRoles("admin"),
  async (req, res) => {
    const users = await UserModel.find().select("-password").lean();
    res.json({ status: "success", users });
  }
);


router.get(
  "/:uid",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    const user = await UserModel.findById(req.params.uid).select("-password").lean();
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });
    res.json({ status: "success", user });
  }
);

 
router.post("/", async (req, res) => {
  const { first_name, last_name, email, age, password, cart, role } = req.body;

  const exists = await UserModel.findOne({ email });
  if (exists) return res.status(400).json({ status: "error", message: "Email already exists" });

  const user = await UserModel.create({
    first_name,
    last_name,
    email,
    age,
    password: createHash(password), // hashSync
    cart,
    role: role || "user",
  });

  res.status(201).json({ status: "success", user: { ...user.toObject(), password: undefined } });
});


router.put("/:uid", async (req, res) => {
  const payload = { ...req.body };

  
  if (payload.password) payload.password = createHash(payload.password);

  const updated = await UserModel.findByIdAndUpdate(req.params.uid, payload, { new: true })
    .select("-password")
    .lean();

  if (!updated) return res.status(404).json({ status: "error", message: "User not found" });
  res.json({ status: "success", user: updated });
});


router.delete("/:uid", async (req, res) => {
  const deleted = await UserModel.findByIdAndDelete(req.params.uid).lean();
  if (!deleted) return res.status(404).json({ status: "error", message: "User not found" });

  res.json({ status: "success", message: "User deleted" });
});

export default router;