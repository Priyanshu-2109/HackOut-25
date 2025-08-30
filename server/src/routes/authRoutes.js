import express from "express";
import passport from "passport";
import {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logoutAll,
  googleAuth
} from "../controllers/authController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  body("username").isString().isLength({ min: 3, max: 30 }),
  body("email").isEmail(),
  body("password").isString().isLength({ min: 8, max: 100 }),
  register
);
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isString().isLength({ min: 8, max: 100 }),
  login
);
router.get("/me", verifyJWT, getProfile);
router.put("/me", verifyJWT, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/logout-all", verifyJWT, logoutAll);
router
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));
router.route("/auth/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  googleAuth
);

export default router;
