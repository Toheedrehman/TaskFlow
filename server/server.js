import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

// =====================================
// CORS
// =====================================

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://task-flow-beige-ten.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// =====================================
// MIDDLEWARE
// =====================================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =====================================
// HEALTH CHECK
// =====================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "TaskFlow API is running",
  });
});

// =====================================
// ROUTES
// =====================================

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// =====================================
// 404
// =====================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// =====================================
// ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

// =====================================
// DATABASE
// =====================================

let mongoConnection;

async function connectDB() {
  if (mongoConnection) {
    return mongoConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is missing");
  }

  mongoConnection = mongoose.connect(process.env.MONGO_URI);

  await mongoConnection;

  console.log("MongoDB connected successfully");

  return mongoConnection;
}

// =====================================
// VERCEL SERVERLESS HANDLER
// =====================================

const handler = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Database/server error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// =====================================
// LOCAL DEVELOPMENT
// =====================================

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error);
    });
}

export default handler;