import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";

import { UserModel } from "../models/user.model.js";
import { CartModel } from "../models/cart.model.js";
import { createHash, isValidPassword } from "../utils/hash.js";

const cookieExtractor = (req) => {
  return req?.cookies?.access_token || null;
};

export const initializePassport = () => {
  
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;

          const exists = await UserModel.findOne({ email });
          if (exists) return done(null, false, { message: "Email already registered" });

          const newCart = await CartModel.create({ products: [] });

          const user = await UserModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password), // hashSync
            cart: newCart._id,
            role: "user",
          });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  
  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) return done(null, false, { message: "User not found" });

        if (!isValidPassword(password, user.password)) {
          return done(null, false, { message: "Invalid credentials" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  
  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = await UserModel.findById(jwtPayload.id).lean();
          if (!user) return done(null, false);

          delete user.password;
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
};