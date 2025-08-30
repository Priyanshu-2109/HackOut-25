import axios from "axios";
import { ApiError, ApiResponse, asyncHandler } from "../utils/api.js";

export const optimizeSystem = asyncHandler(async (req, res) => {
  // Forward request to Python backend
  try {
    const response = await axios.post(
      "http://localhost:5000/optimize",
      req.body
    );
    res
      .status(200)
      .json(new ApiResponse(200, response.data, "Optimization result"));
  } catch (error) {
    throw new ApiError(
      500,
      "Python backend error: " + (error.response?.data?.error || error.message)
    );
  }
});
