import dotenv from "dotenv";
import connectDB from "./config/db.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";

dotenv.config({
  path: "./.env",
});

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(morgan("dev"));

app.use(cookieParser());

app.use(clerkMiddleware());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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
