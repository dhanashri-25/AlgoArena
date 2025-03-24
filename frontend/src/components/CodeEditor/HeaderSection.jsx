import React from "react";
import { ArrowLeft, Play, Upload, RefreshCw, Sun, Moon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeaderSection = ({ isDarkMode, setProblemsVisible, runCodeHandler, submitCodeHandler, resetCode, toggleDarkMode, isRunning, selectedProblem, buttonClass, headerClass }) => {
  const navigate = useNavigate();
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-t-md ${headerClass}`}>
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/")} className={`px-3 py-2 rounded-md ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => setProblemsVisible(prev => !prev)}>
          Problems
        </h1>
      </div>
      <div className="flex gap-2">
        <button onClick={runCodeHandler} disabled={isRunning} className={`${buttonClass} px-6 py-2 rounded-md flex items-center gap-2 ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}>
          <Play size={18} /> Run
        </button>
        <button onClick={submitCodeHandler} disabled={isRunning} className={`${buttonClass} px-6 py-2 rounded-md flex items-center gap-2 ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}>
          <Upload size={18} /> Submit
        </button>
        <button onClick={resetCode} className={`${buttonClass} px-6 py-2 rounded-md flex items-center gap-2`}>
          <RefreshCw size={18} /> Reset
        </button>
        <button onClick={toggleDarkMode} className={`${buttonClass} px-3 py-2 rounded-md flex items-center`}>
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
      <div className="cursor-pointer hover:text-gray-400">
        <User size={24} />
      </div>
    </div>
  );
};

export default HeaderSection;
