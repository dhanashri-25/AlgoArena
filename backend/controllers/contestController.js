import { User, Contest, Question, ContestResult } from "../models/User.js";

// GET /current-contest
export const getCurrentContest = async (req, res) => {
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
};

// GET /current
export const getAllCurrentContests = async (req, res) => {
  try {
    const currentContests = await Contest.find({ status: "current" }).populate(
      "questions"
    );
    res.json(currentContests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /upcoming
export const getUpcomingContests = async (req, res) => {
  try {
    const upcomingContests = await Contest.find({ status: "upcoming" });
    res.json(upcomingContests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /completed
export const getCompletedContests = async (req, res) => {
  try {
    const completedContests = await Contest.find({ status: "completed" });
    res.json(completedContests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /register
export const registerForContest = async (req, res) => {
  try {
    const { contestId, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const contest = await Contest.findById(contestId);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    if (contest.registeredUsers?.some((id) => id.toString() === userId)) {
      return res.status(400).json({ message: "User already registered" });
    }

    contest.registeredUsers = contest.registeredUsers || [];
    contest.registeredUsers.push(userId);
    await contest.save();

    const today = new Date();
    today.setHours(8, 0, 0, 0);

    let contestResult = await ContestResult.findOne({
      user: userId,
      contest: contestId,
    });

    if (!contestResult) {
      contestResult = new ContestResult({
        user: userId,
        contest: contestId,
        score: 0,
        totalTime: 0,
        solvedQuestions: [],
        questionSubmissionTimes: [],
        startTime: today,
      });

      await contestResult.save();
      console.log("contest defaul saved after registration");
    }

    res.json({ message: "Registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /unregister
export const unregisterFromContest = async (req, res) => {
  try {
    const { contestId, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const contest = await Contest.findById(contestId);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    if (
      !contest.registeredUsers?.some(
        (id) => id.toString() === userId.toString()
      )
    ) {
      return res
        .status(400)
        .json({ message: "User is not registered in the contest" });
    }

    contest.registeredUsers = contest.registeredUsers.filter(
      (id) => id.toString() !== userId.toString()
    );

    await contest.save();
    res.json({ message: "Unregistered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /contest/:id
export const getContestById = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id).populate({
      path: "questions",
      populate: { path: "testcases" },
    });

    if (!contest) return res.status(404).json({ error: "Contest not found" });

    res.json({ contest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
