// routes/codeRoutes.js
import express from "express";
import axios from "axios";
import { ContestResult, User, Question, Contest } from "../models/User.js";
import { middle } from "../middleware.js";
import { checkContestStatus } from "../middleware/checkContestStatus.js";

const router = express.Router();

const JUDGE0_API = `https://judge0-ce.p.rapidapi.com`;

// Route for running code (test runs, no contest state changes)
router.post("/run-code", async (req, res) => {
  try {
    const { language, code, testCases, language_id, wrapCode } = req.body;
    if (!code || !language || !testCases || !Array.isArray(testCases)) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const results = [];

    for (let i = 0; i < Math.min(2, testCases.length); i++) {
      const tc = testCases[i];

      const inputObject = Object.fromEntries(
        tc.input.reduce((acc, val, index, arr) => {
          if (index % 2 === 0) {
            acc.push([val, arr[index + 1]]);
          }
          return acc;
        }, [])
      );

      let finalSourceCode = wrapCode;
      Object.entries(inputObject).forEach(([key, value]) => {
        if (
          value.startsWith("[") &&
          value.endsWith("]") &&
          language_id !== 71
        ) {
          value = value.replace("[", "{").replace("]", "}");
        }
        finalSourceCode = finalSourceCode.replace(
          new RegExp(`{${key}}`, "g"),
          value
        );
      });

      const source_code =
        language_id !== 71
          ? finalSourceCode + "\n" + code
          : code + "\n" + finalSourceCode;

      // Submit code to Judge0 API
      const submission = await axios.post(
        `${JUDGE0_API}/submissions?base64_encoded=false&wait=false`,
        {
          language_id,
          source_code,
          expected_output: tc.output,
          cpu_time_limit: 2,
          memory_limit: 128000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": `judge0-ce.p.rapidapi.com` || "", // optional if using RapidAPI
            "X-RapidAPI-Key":
              `7fb0c2fe04msh3281c555f84c91bp182f90jsn55ee78060ffd` || "", // optional if using RapidAPI
          },
        }
      );

      const token = submission.data.token;
      let result;

      while (true) {
        result = await axios.get(
          `${JUDGE0_API}/submissions/${token}?base64_encoded=false`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-RapidAPI-Host": `judge0-ce.p.rapidapi.com` || "",
              "X-RapidAPI-Key":
                `7fb0c2fe04msh3281c555f84c91bp182f90jsn55ee78060ffd` || "",
            },
          }
        );
        if (result.data.status.id >= 3) break;
        await new Promise((r) => setTimeout(r, 1000));
      }

      results.push(result.data);
    }

    res.json({ results, success: true });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/submit-code", middle, checkContestStatus, async (req, res) => {
  const userId = req.userId;

  try {
    const {
      language,
      code,
      testCases,
      language_id,
      wrapCode,
      contestId,
      score,
      problemId,
    } = req.body;

    if (
      !code ||
      !language ||
      !testCases ||
      !Array.isArray(testCases) ||
      !problemId ||
      !contestId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let contestResult = await ContestResult.findOne({
      user: userId,
      contest: contestId,
    });

    const today = new Date();
    today.setHours(8, 0, 0, 0);
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
      console.log("Default contest formed after clicking on submit");
    }

    await contestResult.save();
    console.log("New contest result saved after submitting 1 question");

    const alreadySolved = contestResult.solvedQuestions.some(
      (qid) => String(qid) === String(problemId)
    );
    if (alreadySolved) {
      return res.json({
        message: "You have already submitted this problem.",
        success: true,
        score: contestResult.score,
      });
    }

    // Validate each test case via Judge0 API
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];

      const inputObject = Object.fromEntries(
        tc.input.reduce((acc, val, index, arr) => {
          if (index % 2 === 0) {
            acc.push([val, arr[index + 1]]);
          }
          return acc;
        }, [])
      );

      let finalSourceCode = wrapCode;
      Object.entries(inputObject).forEach(([key, value]) => {
        if (
          value.startsWith("[") &&
          value.endsWith("]") &&
          language_id !== 71
        ) {
          value = value.replace("[", "{").replace("]", "}");
        }
        finalSourceCode = finalSourceCode.replace(
          new RegExp(`{${key}}`, "g"),
          value
        );
      });

      const source_code = `${finalSourceCode}\n${code}`;

      const submission = await axios.post(
        `${JUDGE0_API}/submissions?base64_encoded=false&wait=false`,
        {
          language_id,
          source_code,
          expected_output: tc.output,
          cpu_time_limit: 2,
          memory_limit: 128000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": `judge0-ce.p.rapidapi.com` || "", // if needed
            "X-RapidAPI-Key":
              `7fb0c2fe04msh3281c555f84c91bp182f90jsn55ee78060ffd` || "", // if needed
          },
        }
      );

      const token = submission.data.token;
      let result;

      while (true) {
        result = await axios.get(
          `${JUDGE0_API}/submissions/${token}?base64_encoded=false`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-RapidAPI-Host": `judge0-ce.p.rapidapi.com` || "",
              "X-RapidAPI-Key":
                `7fb0c2fe04msh3281c555f84c91bp182f90jsn55ee78060ffd` || "",
            },
          }
        );
        if (result.data.status.id >= 3) break;
        await new Promise((r) => setTimeout(r, 1000)); // 1 second wait
      }

      if (result.data.status.description !== "Accepted") {
        contestResult.totalTime += 5;
        await contestResult.save();
        return res.json({ results: [result.data], index: i, success: false });
      }
    }

    const diffInMs = new Date() - contestResult.startTime;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    console.log("this is diff in min", diffInMinutes);

    const updateResult = await ContestResult.findOneAndUpdate(
      {
        user: userId,
        contest: contestId,
        solvedQuestions: { $ne: problemId },
      },
      {
        $inc: { score: score || 5 },
        $push: {
          solvedQuestions: problemId,
          questionSubmissionTimes: {
            questionId: problemId,
            timeInMinutes: diffInMinutes,
          },
        },
      },
      { new: true }
    );

    if (!updateResult) {
      return res.json({
        message: "You have already submitted this problem.",
        success: true,
        score: contestResult.score,
      });
    }

    const user = await User.findById(userId);
    user.contestHistory.push(contestResult._id);
    user.contestsParticipated.push(contestId);
    user.problemSolved.push(problemId);

    const question = await Question.findById({ _id: problemId });
    question.solvedBy.push(userId);

    await user.save();
    await question.save();

    console.log("updated user........", user);
    console.log("updated question .......", question);

    res.json({
      message: "Accepted",
      success: true,
      score: updateResult.score,
    });
  } catch (error) {
    console.error(
      "Error in /api/submit-code:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: error.message });
  }
});
export default router;
