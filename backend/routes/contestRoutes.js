import express from "express";
import { User,Contest, Question } from "../models/User.js"; // Ensure Contest & Question are exported from the correct file

const router = express.Router();

// Existing GET routes ...

router.get("/current-contest", async (req, res) => {
  try {
    const contest = await Contest.findOne({ status: "current" }).populate({
      path: "questions",
      populate: { path: "testcases" },
    });

    if (!contest) {
      const questions = await Question.aggregate([{ $sample: { size: 4 } }]);
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

router.get("/upcoming", async (req, res) => {
  try {
    const upcomingContests = await Contest.find({ status: "upcoming" });
    res.json(upcomingContests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/completed", async (req, res) => {
  try {
    const completedContests = await Contest.find({ status: "completed" });
    res.json(completedContests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    console.log("Received registration request:", req.body);
    const { contestId, userId } = req.body;
    console.log("Contest ID:", contestId);
    console.log("User ID:", userId);

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User found:", user);

    // Validate contest
    const contest = await Contest.findById(contestId);
    if (!contest) {
      console.log("Contest not found");
      return res.status(404).json({ message: "Contest not found" });
    }
    console.log("Contest found:", contest);

    // Check if the user is already registered
    if (
      contest.registeredUsers &&
      contest.registeredUsers.some((id) => id.toString() === userId)
    ) {
      console.log("User already registered");
      return res.status(400).json({ message: "User already registered" });
    }

    // If the field doesn't exist yet, initialize it
    if (!contest.registeredUsers) {
      contest.registeredUsers = [];
    }
    // Add user to the registeredUsers array
    contest.registeredUsers.push(userId);
    console.log("Updated registeredUsers:", contest.registeredUsers);
    await contest.save();

    console.log("Registration successful");
    return res.json({ message: "Registered successfully!" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
export default router;
