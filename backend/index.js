import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import contestRoutes from "./routes/contestRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import "./Scheduler.js";
import Result from "./controllers/ResultController.js";
import { middle } from "./middleware.js";
import { leaderboard } from "./controllers/leaderboardController.js";
import { getProfileInfo } from "./controllers/profileController.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cookieParser());
app.use(
  cors({
    origin: "https://algo-arena-lilac.vercel.app",
    credentials: true,
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

app.get("/", (req, res) => res.send("Server is running"));

app.use("/api/auth", authRouter);
app.use("/api/contests", contestRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/code", codeRoutes);

app.use("/api/contest/:contestId/results", middle, Result);

app.use("/api/contest/leaderboard/:contestId", leaderboard);

app.use("/api/profile/:id", getProfileInfo);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
