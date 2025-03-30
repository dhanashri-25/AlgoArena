import React from "react";

const TestCaseItem = ({ testCase, isDarkMode }) => {
  return (
    <div className={`${isDarkMode ? "bg-[#1e1e1e]" : "bg-white border"} p-3 mb-2 rounded-md`}>
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold">Test Case #{testCase.id}</div>
        <div className={`px-2 py-1 rounded text-white ${testCase.status === "Accepted" ? "bg-green-600" : "bg-red-600"}`}>
          {testCase.status}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm opacity-70">Input:</div>
          <div className={`${isDarkMode ? "bg-[#2d2d2d]" : "bg-gray-100"} p-2 rounded mt-1 text-sm`}>
          <code>
                  {testCase.input.map((val, index) => 
                    index % 2 === 0 
                      ? <span key={index} className="text-blue-500">{val}: </span>  
                      : <span key={index}>  
                          <span className="text-green-500">{val}</span> 
                          {index !== testCase.input.length - 1 && <span> , </span>} 
                        </span>
                  )}
                </code>
          </div>
        </div>
        <div>
          <div className="text-sm opacity-70">Expected Output:</div>
          <div className={`${isDarkMode ? "bg-[#2d2d2d]" : "bg-gray-100"} p-2 rounded mt-1 text-sm`}>
          <code>{testCase.expectedOutput}</code>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className="text-sm opacity-70">Your Output:</div>
        <div className={`${isDarkMode ? "bg-[#2d2d2d]" : "bg-gray-100"} p-2 rounded mt-1 text-sm`}>
          {testCase.actualOutput}
        </div>
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <div>Runtime: {testCase.runtime}</div>
        <div>Memory: {testCase.memory}</div>
      </div>
    </div>
  );
};

export default TestCaseItem;