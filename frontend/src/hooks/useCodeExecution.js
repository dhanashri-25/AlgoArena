// src/hooks/useCodeExecution.js
import { useState } from "react";

const useCodeExecution = () => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const runCodeHandler = async ({ selectedProblem, code, selectedLang, languages }) => {
    if (!selectedProblem) {
      setModalMessage("Please select a problem first!");
      setShowModal(true);
      return;
    }
    setCorrect(false);
    setIsRunning(true);
    setOutput("Running...");
    const selectedLanguage = languages.find((lang) => lang.value === selectedLang);
    const testCasesForJudge = selectedProblem.testcases;
    
    const requestData = {
      language: selectedLanguage,
      language_id: selectedLanguage.id,
      code,
      testCases: testCasesForJudge,
      wrapCode: selectedProblem.wrapperCode[selectedLang],
    };

    try {
      const response = await fetch("http://localhost:5000/api/code/run-code", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      console.log("Run-code result:", result);
      if (!Array.isArray(result.results))
        throw new Error("Unexpected response format from Judge0");

      const newTestCases = result.results.map((res, idx) => {
        const cleanOutput = res.stdout?.trim().replace(/\r\n/g, "\n");
        const expectedOutput = (testCasesForJudge[idx]?.output || "").trim().replace(/\r\n/g, "\n");
        // For simplicity, render input as a simple string; you can customize as needed.
        const input = testCasesForJudge[idx]?.input.join(", ");
        return {
          id: idx + 1,
          input,
          expectedOutput,
          actualOutput: cleanOutput || "No output",
          runtime: res.time ? `${res.time}ms` : "N/A",
          memory: res.memory ? `${res.memory}KB` : "N/A",
          status: cleanOutput === expectedOutput ? "Accepted" : "Wrong Answer",
        };
      });
      setTestCases(newTestCases);
      setOutput(newTestCases.map((tc) => `Test Case ${tc.id}: ${tc.status}`).join("\n"));
    } catch (error) {
      setOutput(`Request failed: ${error.message}`);
      console.error("Error running code:", error);
    } finally {
      setIsRunning(false);
    }
  };

  return {
    output,
    isRunning,
    testCases,
    correct,
    setCorrect,
    runCodeHandler,
    modalMessage,
    setModalMessage,
    showModal,
    setShowModal,
    setTestCases,
  };
};

export default useCodeExecution;
