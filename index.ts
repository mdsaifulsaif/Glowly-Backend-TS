// import dotenv from "dotenv";
// dotenv.config();
// import app from "./src/app";
// import connectDB from "./src/app/config/db";


// const PORT: number = Number(process.env.PORT) || 5001;

// const startServer = async (): Promise<void> => {
//   try {
//     await connectDB();

//     app.listen(PORT, () => {
//       console.log(`=================================`);
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
//       console.log(`=================================`);
//     });
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1);
//   }
// };

// startServer();

// process.on("unhandledRejection", (err: Error) => {
//   console.log(
//     `Shutting down the server due to Unhandled Promise Rejection: ${err.message}`,
//   );
//   process.exit(1);
// });




import dotenv from "dotenv";
dotenv.config();

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

import app from "./src/app";
import connectDB from "./src/app/config/db";

const PORT: number = Number(process.env.PORT) || 5001;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`=================================`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`=================================`);
    });

    // ২. আনহ্যান্ডেলড রিজেকশন হ্যান্ডলার
    process.on("unhandledRejection", (err: Error) => {
      console.log(`Error: ${err.message}`);
      console.log(`Shutting down the server due to Unhandled Promise Rejection`);
      
      // সার্ভার ক্লিনলি বন্ধ করে তারপর প্রসেস এক্সিট করা
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();