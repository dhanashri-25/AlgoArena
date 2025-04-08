// routes/codeRoutes.js
import express from "express";
import axios from "axios";
import { ContestResult } from "../models/User.js";
import { middle } from "../middleware.js";

const router = express.Router();
const JUDGE0_API = "http://localhost:2358";

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
        tc.input.reduce((acc, val, index) => {
          if (index % 2 === 0) {
            acc.push([val, tc.input[index + 1]]);
          }
          return acc;
        }, [])
      );

      let finalSourceCode = wrapCode;
      console.log(finalSourceCode);

      Object.entries(inputObject).forEach(([key, value]) => {
        console.log("key : ", key, " , value : ", value);

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

      let source_code = "";
      if (language_id !== 71) {
        source_code = finalSourceCode + "\n" + code;
      } else {
        source_code = code + "\n" + finalSourceCode;
      }

      console.log("source code ........\n", source_code);

      const submission = await axios.post(
        `${JUDGE0_API}/submissions?base64_encoded=false&wait=false`,
        {
          language_id: language_id,
          source_code,
          expected_output: tc.output,
          cpu_time_limit: 2,
          memory_limit: 128000,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const token = submission.data.token;
      console.log("token Found ", token);
      let result;
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
    console.log(results);
    res.json({ results, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/submit-code", middle, async (req, res) => {
  const userId = req.userId;

  try {
    console.log("inside judge0 .............................................");

    const { language, code, testCases, language_id, wrapCode, contestId } =
      req.body;

    if (!code || !language || !testCases || !Array.isArray(testCases)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("got the data correctly....................................");

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];

      const inputObject = Object.fromEntries(
        tc.input.reduce((acc, val, index) => {
          if (index % 2 === 0) {
            acc.push([val, tc.input[index + 1]]);
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
          headers: { "Content-Type": "application/json" },
        }
      );

      const token = submission.data.token;
      console.log("token Found", token);

      let result;
      while (true) {
        result = await axios.get(
          `${JUDGE0_API}/submissions/${token}?base64_encoded=false`,
          { headers: { "Content-Type": "application/json" } }
        );
        if (result.data.status.id >= 3) break;
        await new Promise((r) => setTimeout(r, 1000));
      }

      console.log("result................", result.data);

      // Find or create a contest result for the user
      let contestResult = await ContestResult.findOne({
        user: userId,
        contest: contestId,
      });

      if (!contestResult) {
        contestResult = await ContestResult.create({
          user: userId,
          contest: contestId,
          score: 0,
          totalTime: 0,
        });
      }

      if (result.data.status.description !== "Accepted") {
        const results = [];
        results.push(result.data);

        contestResult.totalTime += 5;
        await contestResult.save();

        console.log("Updated result:", contestResult);

        return res.json({ results, index: i, success: false });
      }
    }
    contestResult.score += 5;
    await contestResult.save();
    console.log("Updated result:", contestResult);

    res.json({ message: "Accepted", success: true });
  } catch (error) {
    console.error("Error in /api/submit-code:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
