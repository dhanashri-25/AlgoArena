// Code.jsx - Main component with finalized contest submission logic
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Split from "react-split";
import HeaderSection from "./HeaderSection.jsx";
import ProblemList from "./ProblemList.jsx";
import ProblemDetails from "./ProblemDetails.jsx";
import EditorSection from "./EditorSection.jsx";
import OutputSection from "./OutputSection.jsx";
import Modal from "../Modal.jsx";
import { useTheme } from "../../hooks/useTheme.jsx";
import { useCodeSubmission } from "../../hooks/useCodeSubmission.jsx";
import { useProblemData } from "../../hooks/useProblemData.jsx";
import { LANGUAGES } from "../../constants/editorConstants.js";

const Code = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contestScore, setContestScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      navigate(`/contest/${id}/results`);
    } catch (error) {
      console.error("Error completing contest:", error);
      alert(
        "An error occurred while completing the contest. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const {
    themeClass,
    headerClass,
    buttonClass,
    sidebarClass,
    editorClass,
    outputClass,
    selectClass,
    isDarkMode,
    toggleDarkMode,
  } = useTheme();

  const {
    code,
    setCode,
    output,
    testCases,
    isRunning,
    correct,
    runCodeHandler,
    submitCodeHandler,
    resetCode,
  } = useCodeSubmission({ setContestScore });

  const {
    randomProblems,
    selectedProblem,
    setSelectedProblem,
    isLoading,
    error,
    selectedLang,
    setSelectedLang,
  } = useProblemData(id, setCode);

  const isContestMode = randomProblems && randomProblems.length > 0;
  //will return true---> if we are in compete page i.e for contest else false

  const [problemsVisible, setProblemsVisible] = useState(false);
  const [switchCount, setSwitchCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (!isContestMode) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setSwitchCount((prev) => prev + 1);
        if (switchCount === 0) {
          setModalMessage(
            "Don't switch tabs! Your contest will be auto-submitted after 2 more tab switches."
          );
          setShowModal(true);
        } else if (switchCount >= 2) {
          handleFinalSubmit();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [switchCount]);

  // // Timer to auto-submit when contest time is up
  // useEffect(() => {
  //   // This would typically be implemented with server-side time validation
  //   // Here's a simple client-side example
  //   const checkContestStatus = async () => {
  //     try {
  //       const response = await axios.get(`/api/contests/${id}/status`);
  //       if (response.data.status === "completed") {
  //         handleFinalSubmit();
  //       }
  //     } catch (error) {
  //       console.error("Error checking contest status:", error);
  //     }
  //   };

  //   // Check every minute
  //   const intervalId = setInterval(checkContestStatus, 60000);

  //   // Initial check
  //   checkContestStatus();

  //   return () => clearInterval(intervalId);
  // }, [id]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={`min-h-screen py-3 px-3 ${themeClass}`}>
      <HeaderSection
        handleFinalSubmit={handleFinalSubmit}
        isDarkMode={isDarkMode}
        setProblemsVisible={setProblemsVisible}
        runCodeHandler={() =>
          runCodeHandler(
            selectedProblem,
            selectedLang,
            setModalMessage,
            setShowModal
          )
        }
        submitCodeHandler={() =>
          submitCodeHandler(
            id,
            selectedProblem,
            selectedLang,
            setModalMessage,
            setShowModal
          )
        }
        resetCode={() => resetCode(selectedProblem, selectedLang)}
        toggleDarkMode={toggleDarkMode}
        isRunning={isRunning || isSubmitting}
        selectedProblem={selectedProblem}
        buttonClass={buttonClass}
        headerClass={headerClass}
        isContestMode={isContestMode}
      />

      <Split
        className="flex h-[calc(100vh-70px)]"
        sizes={[40, 60]}
        minSize={300}
        gutterSize={8}
        gutterAlign="center"
        snapOffset={30}
      >
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

        <Split
          className="flex flex-col w-full h-full"
          sizes={[70, 30]}
          minSize={100}
          gutterSize={8}
          direction="vertical"
          gutterAlign="center"
          snapOffset={30}
        >
          <EditorSection
            selectedLang={selectedLang}
            setSelectedLang={setSelectedLang}
            code={code}
            setCode={setCode}
            isDarkMode={isDarkMode}
            selectClass={selectClass}
            editorClass={editorClass}
            selectedProblem={selectedProblem}
            languages={LANGUAGES}
          />
          <OutputSection
            isDarkMode={isDarkMode}
            selectedProblem={selectedProblem}
            correct={correct}
            outputClass={outputClass}
            output={output}
            testCases={testCases}
            isRunning={isRunning}
            contestScore={contestScore}
          />
        </Split>
      </Split>

      {showModal && (
        <Modal
          message={modalMessage}
          onClose={() => setShowModal(false)}
          isDarkMode={isDarkMode}
          buttonClass={buttonClass}
        />
      )}
    </div>
  );
};

export default Code;
