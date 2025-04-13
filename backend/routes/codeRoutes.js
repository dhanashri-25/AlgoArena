// routes/codeRoutes.js
import express from "express";
import axios from "axios";
import { ContestResult } from "../models/User.js"; // Ensure this file exports the updated ContestResult model
import { middle } from "../middleware.js";

const router = express.Router();
const JUDGE0_API = "http://localhost:2358";

// Route for running code (test runs, no contest state changes)
router.post("/run-code", async (req, res) => {
  try {
    const { language, code, testCases, language_id, wrapCode } = req.body;
    if (!code || !language || !testCases || !Array.isArray(testCases)) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const results = [];

    // Test only a subset (first two test cases)
    for (let i = 0; i < Math.min(2, testCases.length); i++) {
      const tc = testCases[i];

      // Build input object from test case input array
      const inputObject = Object.fromEntries(
        tc.input.reduce((acc, val, index, arr) => {
          if (index % 2 === 0) {
            acc.push([val, arr[index + 1]]);
          }
          return acc;
        }, [])
      );

      // Prepare the source code by replacing placeholders with actual values
      let finalSourceCode = wrapCode;
      Object.entries(inputObject).forEach(([key, value]) => {
        // Replace [ ] with { } for non-C++ language (or when language_id !== 71)
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

      // Assemble the complete source code (order may vary based on language)
      const source_code =
        language_id !== 71
          ? finalSourceCode + "\n" + code
          : code + "\n" + finalSourceCode;

      // Send submission request to Judge0 API
      const submission = await axios.post(
        `${JUDGE0_API}/submissions?base64_encoded=false&wait=false`,
        {
          language_id,
          source_code,
          expected_output: tc.output,
          cpu_time_limit: 2,
          memory_limit: 128000,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = submission.data.token;
      let result;
      // Poll for the result until it is ready
      while (true) {
        result = await axios.get(
          `${JUDGE0_API}/submissions/${token}?base64_encoded=false`,
          { headers: { "Content-Type": "application/json" } }
        );
        if (result.data.status.id >= 3) break;
        await new Promise((r) => setTimeout(r, 1000));
      }
      results.push(result.data);
    }

    res.json({ results, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/submit-code", middle, async (req, res) => {
  const userId = req.userId; // after calling to middleware it attach authenticated useid to req object

  //extracting prop from body--it will come from frontend
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

    //it finds in db ki koi user ne ye contest submit kia hai ki nhi
    let contestResult = await ContestResult.findOne({
      user: userId,
      contest: contestId,
    });

    //if there is no contestresult in db then make default
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
    }

    await contestResult.save(); //saving new contest result to db
    console.log("new contest result saved after submitting 1 question");

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
        { headers: { "Content-Type": "application/json" } }
      );

      const token = submission.data.token;
      let result;
      while (true) {
        result = await axios.get(
          `${JUDGE0_API}/submissions/${token}?base64_encoded=false`,
          { headers: { "Content-Type": "application/json" } }
        );
        if (result.data.status.id >= 3) break;
        await new Promise((r) => setTimeout(r, 1000));
      }

      if (result.data.status.description !== "Accepted") {
        contestResult.totalTime += 5;
        await contestResult.save();
        return res.json({ results: [result.data], index: i, success: false });
      }
    }

    const diffInMs = new Date() - contestResult.startTime;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    console.log("this is diffin min", diffInMinutes);

    const updateResult = await ContestResult.findOneAndUpdate(
      {
        user: userId,
        contest: contestId,
        solvedQuestions: { $ne: problemId }, //$-->in mongodb means does not contain problemId already in db
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

    res.json({
      message: "Accepted",
      success: true,
      score: updateResult.score,
    });
  } catch (error) {
    console.error("Error in /api/submit-code:", error);
    res.status(500).json({ error: error.message });
  }
});
export default router;
