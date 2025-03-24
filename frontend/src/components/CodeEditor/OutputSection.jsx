import React from "react";
import TestCaseItem from "./TestCaseItem.jsx";

const OutputSection = ({ isDarkMode, outputClass, testCases, isRunning, setTestCases }) => {
  return (
    <div className={`${outputClass} overflow-auto`}>
      <div className="sticky top-0 z-10 p-4 pb-2 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-lg font-semibold">Test Cases</h2>
        {testCases.length > 0 && (
          <button
            onClick={() => setTestCases([])}
            className={`text-sm ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"}`}
          >
            Clear All
          </button>
        )}
      </div>
      <div className="p-4 pt-2">
        {testCases.length > 0 ? (
          <div className="space-y-4">
            {testCases.map((testCase) => (
              <TestCaseItem key={testCase.id} testCase={testCase} isDarkMode={isDarkMode} />
            ))}
          </div>
        ) : (
          <div className={`${isDarkMode ? "bg-[#1e1e1e]" : "bg-white"} p-4 rounded-md text-center`}>
            {isRunning ? <div>Running your code...</div> : <div>Run your code to see test results</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputSection;
