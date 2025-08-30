import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import logger from "./src/config/logger.js";
import rateLimit from "express-rate-limit";
import connectDB from "./src/config/db.js";
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
import { swaggerUi, swaggerSpec } from "./src/config/swagger.js";

dotenv.config({
  path: "./.env",
});

import favoriteRoutes from "./src/routes/favoriteRoutes.js";

const app = express();

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

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
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Rate limiting for all API endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(morgan("dev"));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// CSRF protection for state-changing routes
const csrfProtection = csrf({ cookie: true });
app.use((req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  csrfProtection(req, res, next);
});

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
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: Date.now() });
});

const port = process.env.PORT;

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("ERROR : ", err);
      throw err;
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed", err);
  });
