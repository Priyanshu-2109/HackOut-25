import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../models/authModel.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/api.js";
import { sendEmail } from "../utils/sendEmail.js";
import { body, validationResult } from "express-validator";

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
};

// --- Helpers ---
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(400, "User doesn't exist in database");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw new ApiError(
      500,
      "Something went wrong while generating access/refresh token"
    );
  }
};

const passwordStrength = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(
    password
  );
};

// --- Profile ---
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(new ApiResponse(200, user, "Profile fetched"));
});

export const updateProfile = [
  body("fullname").optional().isString().trim(),
  body("phoneNo").optional().isString().trim(),
  body("email").optional().isEmail().normalizeEmail(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        new ApiResponse(
          400,
          null,
          errors
            .array()
            .map((e) => e.msg)
            .join(", ")
        )
      );
    }
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    if (req.body.fullname) user.fullname = req.body.fullname;
    if (req.body.phoneNo) user.phoneNo = req.body.phoneNo;
    if (req.body.email) user.email = req.body.email;

    await user.save({ validateBeforeSave: false });
    res.status(200).json(new ApiResponse(200, user, "Profile updated"));
  }),
];

// --- Register ---
const registerValidators = [
  body("username").isString().trim().notEmpty().isLength({ min: 3, max: 32 }),
  body("fullname").isString().trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("password")
    .custom((value) => passwordStrength(value))
    .withMessage(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
    ),
  body("phoneNo").isString().trim().notEmpty().isLength({ min: 10, max: 15 }),
];

export const register = [
  ...registerValidators,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        new ApiResponse(
          400,
          null,
          errors
            .array()
            .map((e) => e.msg)
            .join(", ")
        )
      );
    }

    const { fullname, email, password, phoneNo } = req.body;
    const username = req.body.username.toLowerCase();

    const existed = await User.findOne({ $or: [{ username }, { email }] });
    if (existed)
      throw new ApiError(400, "User already exists, please try to login");

    const user = await User.create({
      username,
      fullname,
      email,
      password,
      phoneNo,
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser)
      throw new ApiError(500, "Something went wrong while registering user");

    return res
      .status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          201,
          { createdUser, accessToken, refreshToken },
          "User registered successfully"
        )
      );
  }),
];

// --- Login ---
const loginValidators = [
  body("username").optional().isString().trim(),
  body("email").optional().isEmail().normalizeEmail(),
  body("password").isString().notEmpty(),
];

export const login = [
  ...loginValidators,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        new ApiResponse(
          400,
          null,
          errors
            .array()
            .map((e) => e.msg)
            .join(", ")
        )
      );
    }

    const { username, email, password } = req.body;
    if (!(username || email))
      throw new ApiError(400, "username or email is required");

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) throw new ApiError(401, "User doesn't exist");

    const isCorrect = await user.isPasswordCorrect(password);
    if (!isCorrect) throw new ApiError(401, "Invalid credentials");

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedIn = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!loggedIn)
      throw new ApiError(500, "Something went wrong while logging in user");

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { loggedIn, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  }),
];

// --- Logout ---
export const logout = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(400, "User is not authenticated");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const logoutAll = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined },
  });
  res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out from all sessions"));
});

// --- Account Management ---
export const deleteAccount = asyncHandler(async (req, res) => {
  const Id = req.user?._id;
  const user = await User.findByIdAndDelete(Id);
  if (!user) throw new ApiError(400, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, phoneNo, email } = req.body;

  if (!fullname && !phoneNo && !email)
    throw new ApiError(400, "All fields cannot be empty");

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(400, "User doesn't exist");

  user.fullname = fullname || user.fullname;
  user.phoneNo = phoneNo || user.phoneNo;
  user.email = email || user.email;

  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Account details updated successfully")
    );
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confPassword } = req.body;
  if (!(confPassword === newPassword))
    throw new ApiError(400, "New password and confirm password must match");

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(400, "User doesn't exist");

  const isCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isCorrect) throw new ApiError(400, "Old password is incorrect");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// --- Forgot/Reset Password ---
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 15;
  await user.save({ validateBeforeSave: false });

  await sendEmail(
    email,
    "Password Reset",
    `Your password reset token: ${resetToken}`
  );

  res.status(200).json(new ApiResponse(200, null, "Password reset email sent"));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword)
    throw new ApiError(400, "All fields required");

  const user = await User.findOne({
    email,
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) throw new ApiError(400, "Invalid or expired token");

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, null, "Password reset successful"));
});

// --- Email Verification ---
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new ApiError(400, "Email and OTP required");

  const user = await User.findOne({
    email,
    otp,
    otpExpiresAt: { $gt: Date.now() },
  });
  if (!user) throw new ApiError(400, "Invalid or expired OTP");

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, null, "Email verified"));
});

// --- OTP ---
export const sendOTPEmail = asyncHandler(async (req, res) => {
  const email = req.user?.email;
  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  const AppName = "Cropsphere";

  if (user.googleId) {
    sendEmail(
      email,
      "Your Login Confirmation of Cropsphere",
      `Hello ${user.username || "there"}, Welcome back!`
    );
    user.isVerified = true;
  } else {
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    sendEmail(
      email,
      "Your One-Time Password (OTP) for Secure Verification",
      `Your OTP is: ${otp}`
    );
  }

  await user.save();
  return res.status(200).json(new ApiResponse(200, "Email sent successfully"));
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { uotp } = req.body;
  const email = req.user?.email;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "User not found");

  if (!user.googleId) {
    if (user.otp !== uotp || user.otpExpiresAt < new Date())
      throw new ApiError(400, "Invalid or expired OTP");

    user.otp = null;
    user.otpExpiresAt = null;
    user.isVerified = true;
  }

  await user.save();
  return res.status(200).json(new ApiResponse(200, "Verified successfully"));
});

// --- Google Auth ---
export const googleAuth = async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User does not exist");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "Google Login successful"
      )
    );
};

// --- Refresh Token ---
export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new ApiError(401, "Refresh token missing");

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(decoded._id);
  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Refresh token not valid for user");
  }

  const accessToken = user.generateAccessToken();
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
});
