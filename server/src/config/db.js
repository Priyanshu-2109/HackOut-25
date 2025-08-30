import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URL
    const connectionInstance = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.info(
      `MongoDB Connected Successfully: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
