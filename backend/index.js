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

const JUDGE0_API = process.env.JUDGE0_API || "http://localhost:2358";
// Judge0 integration
app.post("/api/run-code", async (req, res) => {
  try {
    const { language, source_code, testCases } = req.body;
    if (!source_code || !language || !testCases || !Array.isArray(testCases)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const results = [];
    // Process each test case individually
    for (const tc of testCases) {
      const submission = await axios.post(
        `${JUDGE0_API}/submissions?base64_encoded=false&wait=false`,
        {
          language_id: language,
          source_code,
          stdin: tc.input || "",
          expected_output: tc.expected_output || "",
          cpu_time_limit: 2,
          memory_limit: 128000,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const token = submission.data.token;
      let result;
      while (true) {
        result = await axios.get(
          `${JUDGE0_API}/submissions/${token}?base64_encoded=false`,
          { headers: { "Content-Type": "application/json" } }
        );
        if (result.data.status.id >= 3) break; // Execution complete
        await new Promise((r) => setTimeout(r, 1000)); // Wait before retry
      }
      results.push(result.data);
    }

    res.json(results);
  } catch (error) {
    console.error("Error in /api/run-code:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
