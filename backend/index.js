import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/authRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("server is running");
});
// app.post("/run",async(req,res)=>)
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
