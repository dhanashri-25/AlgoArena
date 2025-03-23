import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Split from "react-split";
import {
  ArrowLeft,
  User,
  RefreshCw,
  Play,
  Upload,
  Moon,
  Sun,
  X,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import problems from "../utils/problems.json";
import DetectMultipleFaces from "./DetectMultipleFaces.jsx";
import VideoFeed from "./VideoFeed.jsx";
import DetectMobile from "./DetectMobile.jsx";

const languages = [
  { label: "C", value: "c", id: 50 },
  { label: "C++", value: "cpp", id: 54 },
  { label: "Java", value: "java", id: 62 },
  { label: "JavaScript", value: "javascript", id: 63 },
  { label: "Python 3", value: "python", id: 71 },
  // ...other languages
];

const difficultyColors = {
  Easy: "bg-green-600",
  Medium: "bg-yellow-600",
  Hard: "bg-red-600",
};

const Code = () => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState(languages[4].value); // Default to Python
  const [code, setCode] = useState("# Write your solution here");
  const [output, setOutput] = useState("");
  const [randomProblems, setRandomProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [problemsVisible, setProblemsVisible] = useState(false);
  const [switchCount, setSwitchCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [videoElement, setVideoElement] = useState(null);

  const getRandomProblems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/current-contest");
      const data = await response.json();
      // data.problems should be an array of question objects from MongoDB
      setRandomProblems(data.problems);
      if (data.problems && data.problems.length > 0) {
        setSelectedProblem(data.problems[0]); // Set the first problem as default
      }
    } catch (error) {
      console.error("Error fetching contest problems:", error);
    }
  };

  useEffect(() => {
    // Handle tab switching
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setSwitchCount((prev) => prev + 1);
        if (switchCount === 0) {
          setModalMessage(
            "Don't switch tabs! Your contest will be auto-submitted after 2 more tab switches."
          );
          setShowModal(true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [switchCount]);

  useEffect(() => {
    if (switchCount > 2) {
      navigate("/submit"); // Redirect after 2+ switches
    }
  }, [switchCount, navigate]);

  useEffect(() => {
    getRandomProblems();
    // Disable copy/paste
    const disableCopyPaste = (event) => event.preventDefault();
    document.addEventListener("contextmenu", disableCopyPaste);
    document.addEventListener("copy", disableCopyPaste);
    document.addEventListener("paste", disableCopyPaste);
    return () => {
      document.removeEventListener("contextmenu", disableCopyPaste);
      document.removeEventListener("copy", disableCopyPaste);
      document.removeEventListener("paste", disableCopyPaste);
    };
  }, []);

  useEffect(() => {
    // Set language-specific starter code
    if (selectedLang === "python") {
      setCode("# Write your solution here");
    } else if (selectedLang === "javascript") {
      setCode("// Write your solution here");
    } else if (selectedLang === "java") {
      setCode(
        "class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}"
      );
    } else if (selectedLang === "cpp") {
      setCode(
        "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}"
      );
    } else {
      setCode("// Write your solution here");
    }
  }, [selectedLang]);

  // Function to call backend API for running code (without DB storage)
  const runCodeHandler = async () => {
    if (!selectedProblem) {
      setModalMessage("Please select a problem first!");
      setShowModal(true);
      return;
    }

    setIsRunning(true);
    setOutput("Running...");

    const selectedLanguage = languages.find(
      (lang) => lang.value === selectedLang
    );

    // Use test cases from the selected problem (from backend), fallback to example if not available
    const testCasesForJudge =
      selectedProblem.testcases && selectedProblem.testcases.length > 0
        ? selectedProblem.testcases.map((tc) => ({
            input: tc.input,
            expected_output: tc.output,
          }))
        : [
            {
              input: selectedProblem.example?.Input || "",
              expected_output: selectedProblem.example?.Output || "",
            },
          ];

    const requestData = {
      language_id: selectedLanguage?.id || 71,
      source_code: code,
      testCases: testCasesForJudge,
    };

    try {
      const response = await fetch("http://localhost:5000/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      // Map the Judge0 response with your test cases
      const newTestCases = result.map((res, idx) => ({
        id: idx + 1,
        input: testCasesForJudge[idx].input,
        expectedOutput: testCasesForJudge[idx].expected_output,
        actualOutput: res.stdout ? res.stdout.trim() : "No output",
        runtime: res.time ? `${res.time}ms` : "N/A",
        memory: res.memory ? `${res.memory}KB` : "N/A",
        status:
          res.stdout &&
          res.stdout.trim() === testCasesForJudge[idx].expected_output.trim()
            ? "Accepted"
            : "Wrong Answer",
      }));

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

  // Function to call backend API for submitting code (and storing data in DB)
  const submitCodeHandler = async () => {
    if (!selectedProblem) {
      setModalMessage("Please select a problem first!");
      setShowModal(true);
      return;
    }

    setIsRunning(true);
    setOutput("Submitting...");

    const selectedLanguage = languages.find(
      (lang) => lang.value === selectedLang
    );

    const testCasesForJudge =
      selectedProblem.testcases && selectedProblem.testcases.length > 0
        ? selectedProblem.testcases.map((tc) => ({
            input: tc.input,
            expected_output: tc.output,
          }))
        : [
            {
              input: selectedProblem.example?.Input || "",
              expected_output: selectedProblem.example?.Output || "",
            },
          ];

    const requestData = {
      language_id: selectedLanguage?.id || 71,
      source_code: code,
      testCases: testCasesForJudge, // Array of { input, expected_output }
      problemId: selectedProblem._id, // Pass the MongoDB question ID
      // Optionally: contestId, userId (if you have authentication middleware)
    };

    try {
      const response = await fetch("http://localhost:5000/api/submit-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      const isCorrect = result.overall_status === "Accepted";

      setModalMessage(
        isCorrect
          ? "✅ Congratulations! Your solution was accepted."
          : "❌ Wrong answer. Please check your solution and try again."
      );
      setShowModal(true);

      const newTestCases = result.test_results.map((res, idx) => ({
        id: idx + 1,
        input: testCasesForJudge[idx].input,
        expectedOutput: testCasesForJudge[idx].expected_output,
        actualOutput: res.stdout ? res.stdout.trim() : "No output",
        runtime: res.time ? `${res.time}ms` : "N/A",
        memory: res.memory ? `${res.memory}KB` : "N/A",
        status:
          res.stdout &&
          res.stdout.trim() === testCasesForJudge[idx].expected_output.trim()
            ? "Accepted"
            : "Wrong Answer",
      }));

      setTestCases(newTestCases);
      setOutput(
        newTestCases.map((tc) => `Test Case ${tc.id}: ${tc.status}`).join("\n")
      );
    } catch (error) {
      setOutput(`Request failed: ${error.message}`);
      console.error("Error submitting code:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const resetCode = () => {
    if (selectedLang === "python") {
      setCode("# Write your solution here");
    } else if (selectedLang === "javascript") {
      setCode("// Write your solution here");
    } else if (selectedLang === "java") {
      setCode(
        "class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}"
      );
    } else if (selectedLang === "cpp") {
      setCode(
        "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}"
      );
    } else {
      setCode("// Write your solution here");
    }
  };

  const themeClass = isDarkMode
    ? "bg-[#131313] text-white"
    : "bg-[#f9f9f9] text-gray-900";
  const headerClass = isDarkMode
    ? "bg-[#111111] text-white"
    : "bg-white text-gray-900 border-b border-gray-200";
  const buttonClass = isDarkMode
    ? "bg-[#262626] hover:bg-gray-700 text-white"
    : "bg-blue-500 hover:bg-blue-600 text-white";
  const sidebarClass = isDarkMode
    ? "bg-[#262626] text-white"
    : "bg-gray-100 text-gray-800 border-r border-gray-200";
  const editorClass = isDarkMode
    ? "bg-[#1e1e1e]"
    : "bg-white border border-gray-200";
  const outputClass = isDarkMode
    ? "bg-[#262626] text-white"
    : "bg-gray-100 text-gray-800 border-t border-gray-200";
  const selectClass = isDarkMode
    ? "bg-[#262626] text-white"
    : "bg-white text-gray-800 border border-gray-300";

  const TestCaseItem = ({ testCase }) => (
    <div
      className={`${
        isDarkMode ? "bg-[#1e1e1e]" : "bg-white border"
      } p-3 mb-2 rounded-md`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold">Test Case #{testCase.id}</div>
        <div
          className={`px-2 py-1 rounded text-white ${
            testCase.status === "Accepted" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {testCase.status}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm opacity-70">Input:</div>
          <div
            className={`${
              isDarkMode ? "bg-[#2d2d2d]" : "bg-gray-100"
            } p-2 rounded mt-1 text-sm`}
          >
            {testCase.input}
          </div>
        </div>
        <div>
          <div className="text-sm opacity-70">Expected Output:</div>
          <div
            className={`${
              isDarkMode ? "bg-[#2d2d2d]" : "bg-gray-100"
            } p-2 rounded mt-1 text-sm`}
          >
            {testCase.expectedOutput}
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className="text-sm opacity-70">Your Output:</div>
        <div
          className={`${
            isDarkMode ? "bg-[#2d2d2d]" : "bg-gray-100"
          } p-2 rounded mt-1 text-sm`}
        >
          {testCase.actualOutput}
        </div>
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <div>Runtime: {testCase.runtime}</div>
        <div>Memory: {testCase.memory}</div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-3 px-3 ${themeClass}`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-t-md ${headerClass}`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className={`px-3 py-2 rounded-md ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <h1
            className="text-2xl font-bold cursor-pointer"
            onClick={() => setProblemsVisible(!problemsVisible)}
          >
            Problems
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runCodeHandler}
            disabled={isRunning}
            className={`${buttonClass} px-6 py-2 rounded-md flex items-center gap-2 ${
              isRunning ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Play size={18} /> Run
          </button>
          <button
            onClick={submitCodeHandler}
            disabled={isRunning}
            className={`${buttonClass} px-6 py-2 rounded-md flex items-center gap-2 ${
              isRunning ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Upload size={18} /> Submit
          </button>
          <button
            onClick={resetCode}
            className={`${buttonClass} px-6 py-2 rounded-md flex items-center gap-2`}
          >
            <RefreshCw size={18} /> Reset
          </button>
          <button
            onClick={toggleDarkMode}
            className={`${buttonClass} px-3 py-2 rounded-md flex items-center`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <div className="cursor-pointer hover:text-gray-400">
          <User size={24} />
        </div>
      </div>

      <div>
        <VideoFeed onStreamReady={setVideoElement} />
        <DetectMultipleFaces videoElement={videoElement} />
        <DetectMobile videoElement={videoElement} />
      </div>

      <Split
        className="flex h-[calc(100vh-70px)]"
        sizes={[40, 60]}
        minSize={300}
        gutterSize={8}
        gutterAlign="center"
        snapOffset={30}
      >
        {/* Problem Description */}
        {problemsVisible ? (
          <div className={`w-full h-full ${sidebarClass} px-5 overflow-auto`}>
            <h2 className="text-2xl font-semibold mb-4 py-5">
              Contest Problems
            </h2>
            {randomProblems.map((prob, index) => (
              <div
                key={prob.id}
                className={`cursor-pointer py-3 px-4 mb-2 rounded-md ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                } ${
                  selectedProblem?.id === prob.id
                    ? isDarkMode
                      ? "bg-gray-700"
                      : "bg-gray-200"
                    : ""
                }`}
                onClick={() => {
                  setSelectedProblem(prob);
                  setProblemsVisible(false);
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium text-lg">
                    {index + 1}.{prob.title}
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs text-white ${
                      difficultyColors[prob.difficulty]
                    }`}
                  >
                    {prob.difficulty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`${sidebarClass} p-4 overflow-auto`}
            style={{ userSelect: "none", WebkitUserSelect: "none" }}
          >
            {selectedProblem && (
              <div className="mt-4">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold mb-2">
                    {selectedProblem.quesNo} . {selectedProblem.title}
                  </h1>
                  <div
                    className={`inline-block px-3 py-1 rounded-md text-white ${
                      difficultyColors[selectedProblem.difficulty]
                    } mt-1`}
                  >
                    {selectedProblem.difficulty}
                  </div>
                </div>

                <div
                  className={`${
                    isDarkMode ? "bg-[#1e1e1e]" : "bg-white"
                  } p-4 rounded-md mb-4`}
                >
                  <h3 className="text-xl font-semibold mb-5">
                    Problem Description
                  </h3>
                  <p className="whitespace-pre-line">
                    {selectedProblem.description}
                  </p>
                </div>
                <div
                  className={`${
                    isDarkMode ? "bg-[#1e1e1e]" : "bg-white"
                  } p-4 rounded-md mb-4`}
                >
                  <h3 className="text-xl font-semibold mb-2">Examples</h3>
                  {selectedProblem.testcases &&
                  selectedProblem.testcases.length > 0 ? (
                    selectedProblem.testcases
                      .slice(0, 2)
                      .map((testcase, index) => (
                        <div key={index} className="mb-4">
                          <div className="mb-2">
                            <div className="font-bold">Input:</div>
                            <div
                              className={`${
                                isDarkMode ? "bg-[#2d2d2d]" : "bg-gray-100"
                              } p-2 rounded mt-1 text-sm`}
                            >
                              {testcase.input}
                            </div>
                          </div>
                          <div className="mb-2">
                            <div className="font-bold">Output:</div>
                            <div
                              className={`${
                                isDarkMode ? "bg-[#2d2d2d]" : "bg-gray-100"
                              } p-2 rounded mt-1 text-sm`}
                            >
                              {testcase.output}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Explanation:</div>
                            <div className="mt-1">{testcase.explanation}</div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div>No examples available</div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setProblemsVisible(true)}
                    className={`${buttonClass} px-4 py-2 rounded-md`}
                  >
                    Back to Problems
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Editor and Output */}
        <Split
          className="flex flex-col w-full h-full"
          sizes={[70, 30]}
          minSize={100}
          gutterSize={8}
          direction="vertical"
          gutterAlign="center"
          snapOffset={30}
        >
          {/* Code Editor */}
          <div className={`flex flex-col ${editorClass} h-full`}>
            <div className="w-full p-2 flex items-center justify-between">
              <select
                className={`${selectClass} px-4 py-2 rounded-md w-48`}
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <div className="text-sm opacity-70">
                {selectedProblem && `Problem: ${selectedProblem.title}`}
              </div>
            </div>
            <Editor
              height="100%"
              language={selectedLang}
              value={code}
              onChange={(value) => setCode(value)}
              theme={isDarkMode ? "vs-dark" : "light"}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                tabSize: 2,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Output */}
          <div className={`${outputClass} overflow-auto`}>
            <div className="sticky top-0 z-10 p-4 pb-2 flex justify-between items-center border-b border-gray-700">
              <h2 className="text-lg font-semibold">Test Cases</h2>
              {testCases.length > 0 && (
                <button
                  onClick={() => setTestCases([])}
                  className={`text-sm ${
                    isDarkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="p-4 pt-2">
              {testCases.length > 0 ? (
                <div className="space-y-4">
                  {testCases.map((testCase) => (
                    <TestCaseItem key={testCase.id} testCase={testCase} />
                  ))}
                </div>
              ) : (
                <div
                  className={`${
                    isDarkMode ? "bg-[#1e1e1e]" : "bg-white"
                  } p-4 rounded-md text-center`}
                >
                  {isRunning ? (
                    <div>Running your code...</div>
                  ) : (
                    <div>Run your code to see test results</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Split>
      </Split>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`${
              isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-800"
            } p-6 rounded-lg shadow-lg max-w-md w-full`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">CodeJudge</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="py-4">{modalMessage}</div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className={`${buttonClass} px-4 py-2 rounded-md`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Code;
