import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    age: { type: Number, required: true, min: 0 },
    password: { type: String, required: true }, // hash
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
    role: { type: String, default: "user" },
    resetToken: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
  },
  
  { timestamps: true }
);

export default mongoose.model("User", userSchema);