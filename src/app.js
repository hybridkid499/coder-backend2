import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import dotenv from "dotenv";

import router from "./routes/index.js";
import { initializePassport } from "./config/passport.config.js";

dotenv.config();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


initializePassport();
app.use(passport.initialize());


app.use("/api", router);


app.get("/", (req, res) => res.send("OK - Backend2 Ecommerce"));

const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    const mongoUri =
  process.env.MONGO_TARGET === "ATLAS"
    ? process.env.MONGO_ATLAS_URL
    : process.env.MONGO_URL;

await mongoose.connect(mongoUri);

    console.log(" MongoDB connected");

    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  } catch (err) {
    console.error(" Error starting server:", err.message);
  }
};

start();