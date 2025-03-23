import express from "express";
import { Contest, Question } from "../models/User.js";

const router = express.Router();

router.get("/current-contest", async (req, res) => {
  try {
    // Find contest with status "current" and populate the questions and nested testcases fields
    const contest = await Contest.findOne({ status: "current" }).populate({
      path: "questions",
      populate: { path: "testcases" },
    });
    if (!contest) {
      // If no contest is scheduled, fallback to random questions with testcases populated
      const questions = await Question.aggregate([{ $sample: { size: 4 } }]);
      // You might need to populate testcases for these random questions as well.
      // For simplicity, you can query for them individually:
      for (let i = 0; i < questions.length; i++) {
        const populatedQuestion = await Question.findById(
          questions[i]._id
        ).populate("testcases");
        questions[i] = populatedQuestion;
      }
      return res.json({ problems: questions });
    }
    res.json({ problems: contest.questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
