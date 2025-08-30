import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "image/webp",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const uploadOnCloudinary = async (path) => {
  try {
    if (!path) return null;
    // Validate file type and size
    const stat = fs.statSync(path);
    if (stat.size > MAX_FILE_SIZE) throw new Error("File too large");
    const mime = (await import("mime-types")).lookup(path);
    if (!allowedMimeTypes.includes(mime)) throw new Error("Invalid file type");
    const response = await cloudinary.uploader.upload(path, {
      resource_type: "auto",
    });
    if (fs.existsSync(path)) {
      try {
        fs.unlinkSync(path);
      } catch (e) {
        // log but do not throw
      }
    }
    return response;
  } catch (error) {
    if (fs.existsSync(path)) {
      try {
        fs.unlinkSync(path);
      } catch (e) {}
    }
    return null;
  }
};

export { uploadOnCloudinary };
