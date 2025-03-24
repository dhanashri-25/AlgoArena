import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Split from "react-split";
import HeaderSection from "./HeaderSection.jsx";
import ProblemList from "./ProblemList.jsx";
import ProblemDetails from "./ProblemDetails.jsx";
import EditorSection from "./EditorSection.jsx";
import OutputSection from "./OutputSection.jsx";
import VideoFeed from "../VideoFeed.jsx";
import DetectMultipleFaces from "../DetectMultipleFaces.jsx";
import DetectMobile from "../DetectMobile.jsx";

const languages = [
  { label: "C", value: "c", id: 50 },
  { label: "C++", value: "cpp", id: 54 },
  { label: "Java", value: "java", id: 62 },
  { label: "JavaScript", value: "javascript", id: 63 },
  { label: "Python 3", value: "python", id: 71 },
];

const Code = () => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState(languages[4].value);
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

  const themeClass = isDarkMode ? "bg-[#131313] text-white" : "bg-[#f9f9f9] text-gray-900";
  const headerClass = isDarkMode ? "bg-[#111111] text-white" : "bg-white text-gray-900 border-b border-gray-200";
  const buttonClass = isDarkMode ? "bg-[#262626] hover:bg-gray-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white";
  const sidebarClass = isDarkMode ? "bg-[#262626] text-white" : "bg-gray-100 text-gray-800 border-r border-gray-200";
  const editorClass = isDarkMode ? "bg-[#1e1e1e]" : "bg-white border border-gray-200";
  const outputClass = isDarkMode ? "bg-[#262626] text-white" : "bg-gray-100 text-gray-800 border-t border-gray-200";
  const selectClass = isDarkMode ? "bg-[#262626] text-white" : "bg-white text-gray-800 border border-gray-300";

  const getRandomProblems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/current-contest");
      const data = await response.json();
      setRandomProblems(data.problems);
      if (data.problems && data.problems.length > 0) {
        setSelectedProblem(data.problems[0]);
      }
    } catch (error) {
      console.error("Error fetching contest problems:", error);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setSwitchCount(prev => prev + 1);
        if (switchCount === 0) {
          setModalMessage("Don't switch tabs! Your contest will be auto-submitted after 2 more tab switches.");
          setShowModal(true);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [switchCount]);

  useEffect(() => {
    if (switchCount > 2) {
      navigate("/submit");
    }
  }, [switchCount, navigate]);

  useEffect(() => {
    getRandomProblems();
    const disableCopyPaste = event => event.preventDefault();
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
    if (selectedLang === "python") {
      setCode("# Write your solution here");
    } else if (selectedLang === "javascript") {
      setCode("// Write your solution here");
    } else if (selectedLang === "java") {
      setCode("class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}");
    } else if (selectedLang === "cpp") {
      setCode("#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}");
    } else {
      setCode("// Write your solution here");
    }
  }, [selectedLang]);

  const runCodeHandler = async () => {
    if (!selectedProblem) {
      setModalMessage("Please select a problem first!");
      setShowModal(true);
      return;
    }
    setIsRunning(true);
    setOutput("Running...");
    const selectedLanguage = languages.find(lang => lang.value === selectedLang);
    
    const testCasesForJudge =
      selectedProblem.testcases && selectedProblem.testcases.length > 0
        ? selectedProblem.testcases.map(tc => ({
            input: tc.input,
            expected_output: tc.output,
          }))
        : [{
            input: selectedProblem.example?.Input || "",
            expected_output: selectedProblem.example?.Output || "",
          }];
    
    const requestData = {
      language: selectedLanguage?.id || 71,
      source_code: code,
      testCases: testCasesForJudge,
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      if (!Array.isArray(result))
        throw new Error("Unexpected response format from Judge0");
      const newTestCases = result.map((res, idx) => ({
        id: idx + 1,
        input: testCasesForJudge[idx]?.input || "",
        expectedOutput: testCasesForJudge[idx]?.expected_output || "",
        actualOutput: res.stdout ? res.stdout.trim() : "No output",
        runtime: res.time ? `${res.time}ms` : "N/A",
        memory: res.memory ? `${res.memory}KB` : "N/A",
        status:
          res.stdout &&
          res.stdout.trim() === (testCasesForJudge[idx]?.expected_output || "").trim()
            ? "Accepted"
            : "Wrong Answer",
      }));
      setTestCases(newTestCases);
      setOutput(newTestCases.map(tc => `Test Case ${tc.id}: ${tc.status}`).join("\n"));
    } catch (error) {
      setOutput(`Request failed: ${error.message}`);
      console.error("Error running code:", error);
    } finally {
      setIsRunning(false);
    }
  };
  

  const submitCodeHandler = async () => {
    if (!selectedProblem) {
      setModalMessage("Please select a problem first!");
      setShowModal(true);
      return;
    }
    setIsRunning(true);
    setOutput("Submitting...");
    const selectedLanguage = languages.find(lang => lang.value === selectedLang);
    const testCasesForJudge = selectedProblem.testcases && selectedProblem.testcases.length > 0 ? selectedProblem.testcases.map(tc => ({
      input: tc.input,
      expected_output: tc.output,
    })) : [{
      input: selectedProblem.example?.Input || "",
      expected_output: selectedProblem.example?.Output || "",
    }];
    const requestData = {
      language_id: selectedLanguage?.id || 71,
      source_code: code,
      testCases: testCasesForJudge,
      problemId: selectedProblem._id,
    };
    try {
      const response = await fetch("http://localhost:5000/api/submit-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      const isCorrect = result.overall_status === "Accepted";
      setModalMessage(isCorrect ? "✅ Congratulations! Your solution was accepted." : "❌ Wrong answer. Please check your solution and try again.");
      setShowModal(true);
      const newTestCases = result.test_results.map((res, idx) => ({
        id: idx + 1,
        input: testCasesForJudge[idx]?.input || "",
        expectedOutput: testCasesForJudge[idx]?.expected_output || "",
        actualOutput: res.stdout ? res.stdout.trim() : "No output",
        runtime: res.time ? `${res.time}ms` : "N/A",
        memory: res.memory ? `${res.memory}KB` : "N/A",
        status: res.stdout && res.stdout.trim() === (testCasesForJudge[idx]?.expected_output || "").trim() ? "Accepted" : "Wrong Answer",
      }));
      setTestCases(newTestCases);
      setOutput(newTestCases.map(tc => `Test Case ${tc.id}: ${tc.status}`).join("\n"));
    } catch (error) {
      setOutput(`Request failed: ${error.message}`);
      console.error("Error submitting code:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    if (selectedLang === "python") {
      setCode("# Write your solution here");
    } else if (selectedLang === "javascript") {
      setCode("// Write your solution here");
    } else if (selectedLang === "java") {
      setCode("class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}");
    } else if (selectedLang === "cpp") {
      setCode("#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}");
    } else {
      setCode("// Write your solution here");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen py-3 px-3 ${themeClass}`}>
      <HeaderSection
        isDarkMode={isDarkMode}
        setProblemsVisible={setProblemsVisible}
        runCodeHandler={runCodeHandler}
        submitCodeHandler={submitCodeHandler}
        resetCode={resetCode}
        toggleDarkMode={toggleDarkMode}
        isRunning={isRunning}
        selectedProblem={selectedProblem}
        buttonClass={buttonClass}
        headerClass={headerClass}
      />
      <div>
        <VideoFeed onStreamReady={setVideoElement} />
        <DetectMultipleFaces videoElement={videoElement} />
        <DetectMobile videoElement={videoElement} />
      </div>
      <Split className="flex h-[calc(100vh-70px)]" sizes={[40, 60]} minSize={300} gutterSize={8} gutterAlign="center" snapOffset={30}>
        {problemsVisible ? (
          <ProblemList
            randomProblems={randomProblems}
            selectedProblem={selectedProblem}
            setSelectedProblem={setSelectedProblem}
            setProblemsVisible={setProblemsVisible}
            isDarkMode={isDarkMode}
          />
        ) : (
          <ProblemDetails
            selectedProblem={selectedProblem}
            isDarkMode={isDarkMode}
            setProblemsVisible={setProblemsVisible}
            buttonClass={buttonClass}
            sidebarClass={sidebarClass}
          />
        )}
        <Split className="flex flex-col w-full h-full" sizes={[70, 30]} minSize={100} gutterSize={8} direction="vertical" gutterAlign="center" snapOffset={30}>
          <EditorSection
            selectedLang={selectedLang}
            code={code}
            setCode={setCode}
            isDarkMode={isDarkMode}
            selectClass={selectClass}
            editorClass={editorClass}
            selectedProblem={selectedProblem}
            languages={languages}
          />
          <OutputSection
            isDarkMode={isDarkMode}
            outputClass={outputClass}
            testCases={testCases}
            isRunning={isRunning}
            setTestCases={setTestCases}
          />
        </Split>
      </Split>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-800"} p-6 rounded-lg shadow-lg max-w-md w-full`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">CodeJudge</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 1 1 .708.708L5.707 6l1.647 1.646a.5.5 0 0 1-.708.708L5 6.707l-1.646 1.647a.5.5 0 0 1-.708-.708L4.293 6 2.646 4.354a.5.5 0 1 1 .708-.708L5 5.293l1.646-1.647z"/>
                </svg>
              </button>
            </div>
            <div className="py-4">{modalMessage}</div>
            <div className="flex justify-end">
              <button onClick={() => setShowModal(false)} className={`${buttonClass} px-4 py-2 rounded-md`}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Code;
