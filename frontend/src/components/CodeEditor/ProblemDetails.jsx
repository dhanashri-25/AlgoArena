import React from "react";
import { difficultyColors } from "../../utils/constants";
import { useAntiCheating } from "../../utils/anticheat";

const ProblemDetails = ({
  selectedProblem,
  isDarkMode,
  setProblemsVisible,
  buttonClass,
  sidebarClass,
}) => {
  const containerRef = useAntiCheating();

  if (!selectedProblem) return <div>No problem selected</div>;
  return (
    <div
      ref={containerRef}
      className={`${sidebarClass} p-4 overflow-auto`}
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      <div className="mt-4">
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-2">
            {selectedProblem.quesNo}. {selectedProblem.title}
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
          <h3 className="text-xl font-semibold mb-5">Problem Description</h3>
          <p className="whitespace-pre-line">{selectedProblem.description}</p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-[#1e1e1e]" : "bg-white"
          } p-4 rounded-md mb-4`}
        >
          <h3 className="text-xl font-semibold mb-2">Examples</h3>
          {selectedProblem.testcases && selectedProblem.testcases.length > 0 ? (
            selectedProblem.testcases.slice(0, 2).map((tc, index) => (
              <div key={index} className="mb-4">
                <div className="mb-2">
                  <div className="font-bold">Input:</div>
                  <div
                    className={`${
                      isDarkMode ? "bg-[#2d2d2d]" : "bg-gray-100"
                    } p-2 rounded mt-1 text-xl`}
                  >
                    <code>
                      {tc.input.map((val, index) =>
                        index % 2 === 0 ? (
                          <span key={index} className="text-blue-500">
                            {val}:{" "}
                          </span>
                        ) : (
                          <span key={index}>
                            <span className="text-green-500">{val}</span>
                            {index !== tc.input.length - 1 && <span> , </span>}
                          </span>
                        )
                      )}
                    </code>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="font-bold">Output:</div>
                  <div
                    className={`${
                      isDarkMode ? "bg-[#2d2d2d]" : "bg-gray-100"
                    } p-2 rounded mt-1 text-xl`}
                  >
                    <code>{tc.output}</code>
                  </div>
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
    </div>
  );
};

export default ProblemDetails;
