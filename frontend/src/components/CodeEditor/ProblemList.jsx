import React from "react";
import { difficultyColors } from "../../utils/constants";

const ProblemList = ({ randomProblems, selectedProblem, setSelectedProblem, setProblemsVisible, isDarkMode , setCode  ,selectedLang }) => {
  return (
    <div className="w-full h-full bg-transparent px-5 overflow-auto" style={{ userSelect: "none", WebkitUserSelect: "none" }}>
      <h2 className="text-2xl font-semibold mb-4 py-5">Contest Problems</h2>
      {randomProblems.map((prob, index) => (
        <div
          key={prob.id}
          className={`cursor-pointer py-3 px-4 mb-2 rounded-md ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} ${selectedProblem?.id === prob.id ? (isDarkMode ? "bg-gray-700" : "bg-gray-200") : ""}`}
          onClick={() => {
            setSelectedProblem(prob);
            setCode(prob.templateCode[selectedLang])
            setProblemsVisible(false);
          }}
        >
          <div className="flex justify-between items-center">
            <div className="font-medium text-lg">{index + 1}. {prob.title}</div>
            <div className={`px-2 py-1 rounded-full text-xs text-white ${difficultyColors[prob.difficulty]}`}>{prob.difficulty}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProblemList;