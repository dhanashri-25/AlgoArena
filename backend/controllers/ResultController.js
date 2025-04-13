import mongoose from "mongoose";
import { ContestResult, Contest } from "../models/User.js";

const Result = async (req, res) => {
  try {
    const userId = req.userId;
    const { contestId } = req.params;

    const result = await ContestResult.find({
      user: userId,
      contest: contestId,
    }).populate({
      path: "questionSubmissionTimes.questionId",
    });

    const contestResult = await ContestResult.findOne({
      user: userId,
      contest: contestId,
    });
    const contest = await Contest.findById(contestId).populate("questions");

    
    const solvedQuestionIdsSet = new Set(
      (contestResult?.solvedQuestions || []).map((id) => id.toString())
    );

    
    console.log("Solved Question IDs:", [...solvedQuestionIdsSet]);


    const unsolvedQuestions = (contest?.questions || []).filter((q) => {
      const qIdStr = q._id.toString();
      if (solvedQuestionIdsSet.has(qIdStr)) {
        console.log(`Question ${qIdStr} is solved`);
      } else {
        console.log(`Question ${qIdStr} is unsolved`);
      }
      return !solvedQuestionIdsSet.has(qIdStr);
    });


    console.log("Unsolved Questions:", unsolvedQuestions);

    console.log("yeeyy hurrayyy ....... ", result);
    return res.json({ success: true, result, unsolvedQuestions });
  } catch (error) {
    console.error("Error fetching contest result:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong", error });
  }
};

export default Result;
