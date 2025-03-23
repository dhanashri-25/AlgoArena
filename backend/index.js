import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import { runCode } from "./judge0.js";
import "./jobs/scheduleContest.js";
import contestRoutes from "./routes/contestRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api", contestRoutes);
// Route to run code using Judge0 integration
app.post("/api/run-code", async (req, res) => {
  try {
    const { code, language, testCases } = req.body;
    if (!code || !language || !testCases) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const result = await runCode(code, language, testCases);
    res.json(result);
  } catch (error) {
    console.error("Error in /api/run-code:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
