import React, { useState } from "react";
import {
  ArrowLeft,
  Play,
  Upload,
  RefreshCw,
  Sun,
  Moon,
  User,
  Flag,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import MyUserMenu from "../MyUserMenu";
import { useAuthContext } from "../../Context/AuthContext";

const HeaderSection = ({
  isDarkMode,
  setProblemsVisible,
  runCodeHandler,
  submitCodeHandler,
  resetCode,
  toggleDarkMode,
  isRunning,
  selectedProblem,
  buttonClass,
  headerClass,
  handleFinalSubmit,
  isContestMode,
}) => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const confirmFinalSubmit = () => {
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    handleFinalSubmit();
    setShowConfirmModal(false);
  };

  const handleModalClose = () => {
    setShowConfirmModal(false);
  };

  const { data } = useAuthContext();
  const id = data?._id;
  return (
    <>
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-t-md ${headerClass}`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className={`px-3 py-2 rounded-md ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          {isContestMode && (
            <h1
              className="text-2xl font-bold cursor-pointer"
              onClick={() => setProblemsVisible((prev) => !prev)}
            >
              Problems
            </h1>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={runCodeHandler}
            disabled={isRunning}
            className={`${buttonClass} px-6 py-2 rounded-md flex items-center gap-2 ${
              isRunning ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Play size={18} /> Run
          </button>
          <button
            onClick={submitCodeHandler}
            disabled={isRunning}
            className={`${buttonClass} px-6 py-2 rounded-md flex items-center gap-2 ${
              isRunning ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Upload size={18} /> Submit
          </button>
          <button
            onClick={resetCode}
            className={`${buttonClass} px-6 py-2 rounded-md flex items-center gap-2`}
          >
            <RefreshCw size={18} /> Reset
          </button>
          <button
            onClick={toggleDarkMode}
            className={`${buttonClass} px-3 py-2 rounded-md flex items-center`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isContestMode ? (
            <button
              onClick={confirmFinalSubmit}
              className={`bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md flex items-center gap-2`}
            >
              <Flag size={18} /> Finish Contest
            </button>
          ) : (
            <></>
          )}
        </div>

        <div
          className="cursor-pointer hover:text-gray-400"
          onClick={() => navigate(`/profile/${id}`)}
        >
          <User size={24} />
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          isDarkMode={isDarkMode}
          buttonClass={buttonClass}
          onConfirm={handleConfirm}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

// Custom Confirm Modal Component
const ConfirmModal = ({ isDarkMode, buttonClass, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${
          isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-800"
        } p-6 rounded-lg shadow-lg max-w-md w-full`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Confirm Submission</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        </div>
        <div className="py-4">
          Are you sure you want to finish the contest? This action cannot be
          undone.
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            } px-4 py-2 rounded-md`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Finish Contest
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
