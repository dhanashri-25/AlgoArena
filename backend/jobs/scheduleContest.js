import cron from "node-cron";
import {Contest,Question} from "../models/User.js";

// This cron job runs every Sunday at midnight (server time)
cron.schedule("0 0 * * 0", async () => {
  try {
    // Fetch 4 random questions from the DB
    const questions = await Question.aggregate([{ $sample: { size: 4 } }]);
    
    // Create or update a contest document with status "current"
    const contest = await Contest.findOneAndUpdate(
      { status: "current" },
      {
        questions: questions.map(q => q._id),
        contestDate: new Date(),
        status: "current",
      },
      { upsert: true, new: true }
    );
    
    console.log("Current contest scheduled with 4 questions:", contest);
  } catch (error) {
    console.error("Error scheduling contest:", error);
  }
});
