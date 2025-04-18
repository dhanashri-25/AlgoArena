import { useState } from "react";
import { LANGUAGES } from "../constants/editorConstants";

export const useCodeSubmission = () => {
  const [code, setCode] = useState("# Write your solution here");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [contestScore, setContestScore] = useState(0);
  const runCodeHandler = async (
    selectedProblem,
    selectedLang,
    setModalMessage,
    setShowModal
  ) => {
    setCorrect(false);
    if (!selectedProblem) {
      setModalMessage("Please select a problem first!");
      setShowModal(true);
      return;
    }
    setIsRunning(true);
    setOutput("Running...");
    const selectedLanguage = LANGUAGES.find(
      (lang) => lang.value === selectedLang
    );
    const testCasesForJudge = selectedProblem.testcases;

    const requestData = {
      language: selectedLanguage,
      language_id: selectedLanguage.id,
      code,
      testCases: selectedProblem.testcases,
      wrapCode: selectedProblem.wrapperCode[selectedLang],
    };

    try {
      const response = await fetch(
        "https://algoarena-gp5i.onrender.com/api/code/run-code",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );
      const result = await response.json();
      console.log(result);
      if (!Array.isArray(result.results))
        throw new Error("Unexpected response format from Judge0");

      const resultArray = Array.isArray(result.results) ? result.results : [];
      const newTestCases = resultArray.map((res, idx) => {
        const cleanOutput = res.stdout?.trim().replace(/\r\n/g, "\n");
        const expectedOutput = (testCasesForJudge[idx]?.output || "")
          .trim()
          .replace(/\r\n/g, "\n");
        const input = testCasesForJudge[idx]?.input.map((val, index) =>
          index % 2 === 0 ? (
            <span key={index} className="text-blue-500">
              {val}:{" "}
            </span>
          ) : (
            <span key={index}>
              <span className="text-green-500">{val}</span>
              {index !== testCasesForJudge[idx].input.length - 1 && (
                <span> , </span>
              )}
            </span>
          )
        );
        return {
          id: idx + 1,
          input: input,
          expectedOutput,
          actualOutput: cleanOutput || "No output",
          runtime: res.time ? `${res.time}ms` : "N/A",
          memory: res.memory ? `${res.memory}KB` : "N/A",
          status: cleanOutput === expectedOutput ? "Accepted" : "Wrong Answer",
        };
      });

      setTestCases(newTestCases);
      setOutput(
        newTestCases.map((tc) => `Test Case ${tc.id}: ${tc.status}`).join("\n")
      );
    } catch (error) {
      setOutput(`Request failed: ${error.message}`);
      console.error("Error running code:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const submitCodeHandler = async (
    contestId,
    selectedProblem,
    selectedLang,
    setModalMessage,
    setShowModal
  ) => {
    setCorrect(false);

    if (!selectedProblem) {
      setModalMessage("Please select a problem first!");
      setShowModal(true);
      return;
    }

    setIsRunning(true);
    setOutput("Submitting...");

    const selectedLanguage = LANGUAGES.find(
      (lang) => lang.value === selectedLang
    );
    const testCasesForJudge = selectedProblem.testcases;

    const requestData = {
      contestId,
      language: selectedLanguage,
      language_id: selectedLanguage.id,
      code,
      score: selectedProblem.points,
      testCases: testCasesForJudge,
      wrapCode: selectedProblem.wrapperCode[selectedLang],
      problemId: selectedProblem._id,
    };

    try {
      const response = await fetch(
        "https://algoarena-gp5i.onrender.com/api/code/submit-code",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      const result = await response.json();

      if (result.success) {
        setModalMessage("✅ Congratulations! Your solution was accepted.");
        setShowModal(true);
        setCorrect(true);

        if (setContestScore) {
          setContestScore(result.score);
        }
      } else {
        setModalMessage(
          "❌ Wrong answer. Please check your solution and try again."
        );
        setShowModal(true);
      }

      const resultArray = Array.isArray(result.results) ? result.results : [];
      const newTestCases = resultArray.map((res, idx) => {
        const cleanOutput = res.stdout?.trim().replace(/\r\n/g, "\n");
        const expectedOutput = (testCasesForJudge[idx]?.output || "")
          .trim()
          .replace(/\r\n/g, "\n");

        const input = testCasesForJudge[idx]?.input.map((val, index) =>
          index % 2 === 0 ? (
            <span key={index} className="text-blue-500">
              {val}:{" "}
            </span>
          ) : (
            <span key={index}>
              <span className="text-green-500">{val}</span>
              {index !== testCasesForJudge[idx].input.length - 1 && (
                <span> , </span>
              )}
            </span>
          )
        );

        return {
          id: idx + 1,
          input: input,
          expectedOutput,
          actualOutput: cleanOutput || "No output",
          runtime: res.time ? `${res.time}ms` : "N/A",
          memory: res.memory ? `${res.memory}KB` : "N/A",
          status: cleanOutput === expectedOutput ? "Accepted" : "Wrong Answer",
        };
      });

      setTestCases(newTestCases);
      setOutput(
        newTestCases.map((tc) => `Test Case ${tc.id}: ${tc.status}`).join("\n")
      );
    } catch (error) {
      setOutput(`Request failed: ${error.message}`);
      console.error("Error running code:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = (selectedProblem, selectedLang) => {
    if (selectedProblem?.templateCode) {
      setCode(selectedProblem.templateCode[selectedLang]);
    }
  };

  return {
    code,
    setCode,
    output,
    testCases,
    setTestCases,
    isRunning,
    correct,
    runCodeHandler,
    submitCodeHandler,
    resetCode,
  };
};
