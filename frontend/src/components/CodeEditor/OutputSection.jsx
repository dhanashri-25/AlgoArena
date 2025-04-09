import React from "react";
import TestCaseItem from "./TestCaseItem.jsx";
import { Trophy, Clock } from "lucide-react";

const OutputSection = ({
  isDarkMode,
  outputClass,
  testCases,
  isRunning,
  setTestCases,
  correct,
  selectedProblem,
  output,
  contestScore,
}) => {
  if (correct) {
    return (
      <div className={`${outputClass} p-6 overflow-auto`}>
        <div
          className={`
          ${
            isDarkMode
              ? "bg-green-900/30 border-green-700"
              : "bg-green-100 border-green-300"
          } 
          border rounded-lg p-6 text-center transition-all duration-300 ease-in-out
        `}
        >
          <div className="flex flex-col items-center space-y-4">
            <Trophy
              size={64}
              className={`${
                isDarkMode ? "text-green-400" : "text-green-600"
              } animate-bounce`}
            />
            <h2
              className={`
              text-2xl font-bold 
              ${isDarkMode ? "text-green-300" : "text-green-800"}
            `}
            >
              Congratulations! 🎉
            </h2>
            <div
              className={`
              flex items-center space-x-4 
              ${isDarkMode ? "text-green-200" : "text-green-700"}
            `}
            >
              <div className="flex items-center space-x-2">
                <Trophy size={20} />
                <span>Points: {contestScore || selectedProblem.points}</span>
                
              </div>
            </div>
            <p
              className={`
              text-lg font-medium 
              ${isDarkMode ? "text-green-200" : "text-green-700"}
            `}
            >
              You solved the problem efficiently!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
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
        {testCases.length > 0 && !isRunning ? (
          <div className="space-y-4">
            {testCases.map((testCase) => (
              <TestCaseItem
                key={testCase.id}
                testCase={testCase}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        ) : (
          <div
            className={`${
              isDarkMode ? "bg-[#1e1e1e]" : "bg-white"
            } p-4 rounded-md text-center`}
          >
            {isRunning ? (
              <div>{output}</div>
            ) : (
              <div>Run your code to see test results</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputSection;
