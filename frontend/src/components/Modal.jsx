import React from 'react';

const Modal = ({ message, onClose, isDarkMode, buttonClass }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${
          isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-800"
        } p-6 rounded-lg shadow-lg max-w-md w-full`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">CodeJudge</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        </div>
        <div className="py-4">{message}</div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`${buttonClass} px-4 py-2 rounded-md`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;