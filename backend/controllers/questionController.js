import { Contest, Question } from "../models/User.js";

export const getPracticeQuestions = async (req, res) => {
  try {
    const contests = await Contest.find({ status: "completed" }).populate("questions");

    let questions = [];
    contests.forEach((contest) => {
      if (contest.questions?.length) {
        questions = questions.concat(contest.questions);
      }
    });

    const uniqueQuestions = [];
    const seenIds = new Set();
    for (const question of questions) {
      if (!seenIds.has(question._id.toString())) {
        uniqueQuestions.push(question);
        seenIds.add(question._id.toString());
      }
    }

    res.json(uniqueQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("testcases")
      .exec();

    if (!question) return res.status(404).json({ error: "Question not found", success: false });

    res.json(question);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
