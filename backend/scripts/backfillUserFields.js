import mongoose, { mongo } from "mongoose";
import { User, Contest, ContestResult } from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
const mongoURI = process.env.MONGO_URI;

async function backfillUsers() {
  try {
    await mongoose.connect(mongoURI);

    console.log("connected to mongodb");

    const users = await User.find();

    for (const user of users) {
      const results = await ContestResult.find({ user: user._id });

      const contestHistory = results.map((r) => r._id);
      const contestsParticipated = results.map((r) => r.contest);
      const problemSolved = results.flatMap((r) => r.solvedQuestions);

      
      const uniqueContests = [
        ...new Set(contestsParticipated.map((id) => id.toString())),
      ];
      const uniqueProblems = [
        ...new Set(problemSolved.map((id) => id.toString())),
      ];

      user.contestHistory = contestHistory;
      user.contestsParticipated = uniqueContests;
      user.problemSolved = uniqueProblems;

      await user.save();
      console.log(`Updated user: ${user.username}`);
    }

    console.log("🎉 All users updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error while updating users:", err);
    process.exit(1);
  }
}

backfillUsers();
