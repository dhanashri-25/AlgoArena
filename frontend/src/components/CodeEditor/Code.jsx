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
import VideoFeed from "../VideoFeed.jsx";
import DetectMultipleFaces from "../DetectMultipleFaces.jsx";
import DetectMobile from "../DetectMobile.jsx";
import { preventCopyingProps } from "../../utils/anticheat.js";

const Code = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contestScore, setContestScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoElement, setVideoElement] = useState(null);

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

  // Tab switching prevention useEffect
  useEffect(() => {
    if (!isContestMode) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setSwitchCount((prev) => prev + 1);

        // Store timestamp in localStorage for additional security
        localStorage.setItem("tabSwitchTime", Date.now());

        if (switchCount === 0) {
          setModalMessage(
            "Warning: Don't switch tabs! Your contest will be auto-submitted after 2 more tab switches."
          );
          setShowModal(true);
        } else if (switchCount === 1) {
          setModalMessage(
            "Final warning: One more tab switch will result in automatic contest submission!"
          );
          setShowModal(true);
        } else if (switchCount >= 2) {
          handleFinalSubmit();
        }
      }
    };

    // Check if user has been away for more than 30 seconds
    const handleFocus = () => {
      const switchTime = localStorage.getItem("tabSwitchTime");
      if (switchTime && Date.now() - parseInt(switchTime) > 30000) {
        setModalMessage(
          "You were away for too long. Contest will be submitted."
        );
        setShowModal(true);
        setTimeout(() => {
          handleFinalSubmit();
        }, 3000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("focus", handleFocus);
    };
  }, [switchCount, isContestMode, handleFinalSubmit]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      className={`min-h-screen py-3 px-3 ${themeClass}`}
      {...preventCopyingProps}
    >
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

        <div>
          <VideoFeed onStreamReady={setVideoElement} />
          <DetectMultipleFaces videoElement={videoElement} />
          <DetectMobile videoElement={videoElement} />
        </div>

        <Split
          className="flex h-[calc(100vh-70px)] [&>*]:overflow-hidden scrollbar-hide"
          sizes={[40, 60]}
          minSize={300}
          gutterSize={8}
          gutterAlign="center"
          snapOffset={30}
        >
          <div className="w-full h-full relative">
            {/* Problem List */}
            <div
              style={{
                transition: "opacity 0.3s ease",
                opacity: problemsVisible ? 1 : 0,
                pointerEvents: problemsVisible ? "auto" : "none",
              }}
              className="absolute inset-0"
            >
              <ProblemList
                randomProblems={randomProblems}
                setCode={setCode}
                selectedLang={selectedLang}
                selectedProblem={selectedProblem}
                setSelectedProblem={setSelectedProblem}
                setProblemsVisible={setProblemsVisible}
                isDarkMode={isDarkMode}
              />
            </div>

            <div
              style={{
                transition: "opacity 0.3s ease",
                opacity: !problemsVisible ? 1 : 0,
                pointerEvents: !problemsVisible ? "auto" : "none",
              }}
              className="absolute inset-0"
            >
              <ProblemDetails
                selectedProblem={selectedProblem}
                isDarkMode={isDarkMode}
                setProblemsVisible={setProblemsVisible}
                buttonClass={buttonClass}
                sidebarClass={sidebarClass}
              />
            </div>
          </div>

          <div className="w-full h-full">
            <Split
              className="flex flex-col w-full h-full [&>*]:overflow-hidden"
              sizes={[70, 30]}
              minSize={100}
              gutterSize={8}
              direction="vertical"
              gutterAlign="center"
              snapOffset={30}
              gutterClassName="bg-transparent hover:bg-gray-600 transition-all"
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
          </div>
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
    </div>
  );
};

export default Code;
