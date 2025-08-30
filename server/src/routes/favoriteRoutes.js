import express from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { body } from "express-validator";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../controllers/favoriteController.js";

const router = express.Router();

router.post(
  "/",
  verifyJWT,
  body("assetType").isString().isLength({ min: 3, max: 50 }),
  body("assetId").isString().isLength({ min: 8, max: 50 }),
  addFavorite
);
router.get("/", verifyJWT, getFavorites);
router.delete(
  "/",
  verifyJWT,
  body("assetType").isString().isLength({ min: 3, max: 50 }),
  body("assetId").isString().isLength({ min: 8, max: 50 }),
  removeFavorite
);

export default router;
