import jwt from "jsonwebtoken";
import { ApiError, asyncHandler } from "../utils/api.js";
import { User } from "../models/authModel.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const authHeader = req.header("Authorization") || "";
    const token =
      req.cookies?.accessToken ||
      (authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Get full user info including role from database
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Token is not verified");
  }
});

export { verifyJWT };
