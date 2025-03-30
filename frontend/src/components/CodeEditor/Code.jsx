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
  { label: "C++", value: "Cpp", id: 54 },
  { label: "Java", value: "Java", id: 62 },
  { label: "Python 3", value: "Python", id: 71 },
];

const Code = () => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState("Java");
  const [isLoading , setIsLoading] = useState(true);
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
  const [correct , setCorrect] = useState(false)
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
        setCode(data.problems[0].templateCode[selectedLang])
        setIsLoading(false)
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

  // useEffect(() => {
  //   if (switchCount > 2) {
  //     navigate("/submit");
  //   }
  // }, [switchCount, navigate]);

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


  const runCodeHandler = async () => {
    setCorrect(false)
    if (!selectedProblem) {
      setModalMessage("Please select a problem first!");
      setShowModal(true);
      return;
    }
    setIsRunning(true);
    setOutput("Running...");
    const selectedLanguage = languages.find(lang => lang.value === selectedLang);
    
    const testCasesForJudge =
      selectedProblem.testcases ;
    
      console.log("Test cases before "  , testCasesForJudge)
    
    const requestData = {
        language: selectedLanguage,
        language_id: selectedLanguage.id ,  
        code,
        testCases: selectedProblem.testcases,
        wrapCode: selectedProblem.wrapperCode[selectedLang]
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();
      console.log(result)

       
      if (!Array.isArray(result.results))
      throw new Error("Unexpected response format from Judge0");
      const resultArray = Array.isArray(result.results) ? result.results : [];

      const newTestCases = resultArray.map((res, idx) => {
        const cleanOutput = res.stdout?.trim().replace(/\r\n/g, "\n");
        const expectedOutput = (testCasesForJudge[idx]?.output || "").trim().replace(/\r\n/g, "\n");
        console.log("case : " , testCasesForJudge[idx])
        const input = testCasesForJudge[idx]?.input.map((val, index) => 
          index % 2 === 0 
            ? <span key={index} className="text-blue-500">{val}: </span>  
            : <span key={index}>  
                <span className="text-green-500">{val}</span> 
                {index !== testCasesForJudge[idx].input.length - 1 && <span> , </span>} 
              </span>
        )
      
        console.log(`Test Case ${idx + 1}:`);
        console.log("Actual Output:", `"${cleanOutput}"`);
        console.log("Expected Output:", `"${expectedOutput}"`);
        console.log("given input:", {input});

      
        return {
          id: idx + 1,
          input: input ,
          expectedOutput,
          actualOutput: cleanOutput || "No output",
          runtime: res.time ? `${res.time}ms` : "N/A",
          memory: res.memory ? `${res.memory}KB` : "N/A",
          status: cleanOutput === expectedOutput ? "Accepted" : "Wrong Answer",
        };
      });
      
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
    setCorrect(false);
    if (!selectedProblem) {
      setModalMessage("Please select a problem first!");
      setShowModal(true);
      return;
    }
    setIsRunning(true);
    setOutput("Submiting...");
    const selectedLanguage = languages.find(lang => lang.value === selectedLang);
    
    const testCasesForJudge =
      selectedProblem.testcases ;
    
      console.log("Test cases before "  , testCasesForJudge)
    
    const requestData = {
        language: selectedLanguage,
        language_id: selectedLanguage.id ,  
        code,
        testCases: selectedProblem.testcases,
        wrapCode: selectedProblem.wrapperCode[selectedLang]
    };
    try {
      const response = await fetch("http://localhost:5000/api/submit-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();

      if(result.success){
        setModalMessage( "✅ Congratulations! Your solution was accepted.");
        setShowModal(true);
        setCorrect(true)
      } else {
        setModalMessage( "❌ Wrong answer. Please check your solution and try again.");
        setShowModal(true);
      }
    
    const idx = result.index;
    
    
    const resultArray = Array.isArray(result.results) ? result.results : [];

      const newTestCases = resultArray.map((res) => {
        const cleanOutput = res.stdout?.trim().replace(/\r\n/g, "\n");
        const expectedOutput = (testCasesForJudge[idx]?.output || "").trim().replace(/\r\n/g, "\n");
        console.log("case : " , testCasesForJudge[idx])
        const input = testCasesForJudge[idx]?.input.map((val, index) => 
          index % 2 === 0 
            ? <span key={index} className="text-blue-500">{val}: </span>  
            : <span key={index}>  
                <span className="text-green-500">{val}</span> 
                {index !== testCasesForJudge[idx].input.length - 1 && <span> , </span>} 
              </span>
        )
      
        console.log(`Test Case ${idx + 1}:`);
        console.log("Actual Output:", `"${cleanOutput}"`);
        console.log("Expected Output:", `"${expectedOutput}"`);
        console.log("given input:", {input});

      
        return {
          id: idx + 1,
          input: input ,
          expectedOutput,
          actualOutput: cleanOutput || "No output",
          runtime: res.time ? `${res.time}ms` : "N/A",
          memory: res.memory ? `${res.memory}KB` : "N/A",
          status: cleanOutput === expectedOutput ? "Accepted" : "Wrong Answer",
        };
      });
      
      setTestCases(newTestCases);
      console.log("after" , newTestCases)
      setOutput(newTestCases.map(tc => `Test Case ${tc.id}: ${tc.status}`).join("\n"));
      
    } catch (error) {
      setOutput(`Request failed: ${error.message}`);
      console.error("Error running code:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
   setCode(selectedProblem.templateCode.selectedLang)
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };


  if(isLoading) return <p>Loading Ho Rhi Hai</p>

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
      {/* <div>
        <VideoFeed onStreamReady={setVideoElement} /> 
        <DetectMultipleFaces videoElement={videoElement} />
        <DetectMobile videoElement={videoElement} />
      </div> */}
      <Split className="flex h-[calc(100vh-70px)]" sizes={[40, 60]} minSize={300} gutterSize={8} gutterAlign="center" snapOffset={30}>
        {problemsVisible ? (
          <ProblemList
            randomProblems={randomProblems}
            setCode={setCode}
            selectedLang={selectedLang}
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
            setSelectedLang={setSelectedLang}
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
            selectedProblem={selectedProblem}
            correct={correct}
            outputClass={outputClass}
            output={output}
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