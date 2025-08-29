import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

    req.user = decodedToken;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Token is not verified");
  }
});

export { verifyJWT };
