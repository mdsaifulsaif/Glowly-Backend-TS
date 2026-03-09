import dotenv from "dotenv";
import app from "./src/app";
import connectDB from "./src/config/db";

dotenv.config();

const PORT: number = Number(process.env.PORT) || 5001;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`=================================`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`=================================`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (err: Error) => {
  console.log(
    `Shutting down the server due to Unhandled Promise Rejection: ${err.message}`,
  );
  process.exit(1);
});
