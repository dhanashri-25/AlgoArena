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
      // If no contest is scheduled, fallback to 4 random questions with testcases populated
      const questions = await Question.aggregate([{ $sample: { size: 4 } }]);

      // Populate testcases for each question individually
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

router.get("/current", async (req, res) => {
  try {
    const currentContests = await Contest.find({ status: "current" });
    res.json(currentContests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch upcoming contests
router.get("/upcoming", async (req, res) => {
  try {
    const upcomingContests = await Contest.find({ status: "upcoming" });
    res.json(upcomingContests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch completed contests (past contests)
router.get("/completed", async (req, res) => {
  try {
    const completedContests = await Contest.find({ status: "completed" });
    res.json(completedContests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

;

export default router;
