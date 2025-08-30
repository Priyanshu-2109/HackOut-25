import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import rateLimit from "express-rate-limit";

import connectDB from "./src/config/db.js";
import logger from "./src/config/logger.js";

// Routers
import authRouter from "./src/routes/authRoutes.js";
import systemRouter from "./src/routes/systemRoutes.js";
import plantRouter from "./src/routes/plantRoutes.js";
import storageRouter from "./src/routes/storageRoutes.js";
import pipelineRouter from "./src/routes/pipelineRoutes.js";
import hubRouter from "./src/routes/hubRoutes.js";
import renewableRouter from "./src/routes/renewableRoutes.js";
import demandRouter from "./src/routes/demandRoutes.js";
import zoneRouter from "./src/routes/zoneRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import optimizationLogRoutes from "./src/routes/optimizationLogRoutes.js";
import postgisRoutes from "./src/routes/postgisRoutes.js";
import favoriteRoutes from "./src/routes/favoriteRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import { swaggerUi, swaggerSpec } from "./src/config/swagger.js";

dotenv.config({ path: "./.env" });

const app = express();

// --- Logging Middleware ---
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// --- Security ---
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// --- Other Middleware ---
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// CSRF protection (only for state-changing routes and in production)
const csrfProtection = csrf({ cookie: true });
app.use((req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

  // Skip CSRF in development mode
  if (process.env.NODE_ENV !== "production") {
    return next();
  }

  csrfProtection(req, res, next);
});

// CSRF token endpoint (only needed in production)
app.get("/api/csrf-token", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    csrfProtection(req, res, () => {
      res.json({ csrfToken: req.csrfToken() });
    });
  } else {
    res.json({ csrfToken: "dev-mode-no-csrf" });
  }
});

// --- Routes ---
app.use("/api/users", authRouter);
app.use("/api/system", systemRouter);
app.use("/api/plants", plantRouter);
app.use("/api/storages", storageRouter);
app.use("/api/pipelines", pipelineRouter);
app.use("/api/hubs", hubRouter);
app.use("/api/renewables", renewableRouter);
app.use("/api/demands", demandRouter);
app.use("/api/zones", zoneRouter);
app.use("/api/projects", projectRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/optimization-logs", optimizationLogRoutes);
app.use("/api/postgis", postgisRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Health check ---
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: Date.now() });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`${err.message}: ${JSON.stringify(req.body)}`);
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = { message, statusCode: 401 };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
});

// --- Start Server ---
const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("ERROR : ", err);
      throw err;
    });

    app.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection failed", err);
  });
