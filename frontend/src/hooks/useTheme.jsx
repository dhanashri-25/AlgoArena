import { useState } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const themeClass = isDarkMode
    ? "bg-[#131313] text-white"
    : "bg-[#f9f9f9] text-gray-900";
  
  const headerClass = isDarkMode
    ? "bg-[#111111] text-white"
    : "bg-white text-gray-900 border-b border-gray-200";
  
  const buttonClass = isDarkMode
    ? "bg-[#262626] hover:bg-gray-700 text-white"
    : "bg-blue-500 hover:bg-blue-600 text-white";
  
  const sidebarClass = isDarkMode
    ? "bg-[#262626] text-white"
    : "bg-gray-100 text-gray-800 border-r border-gray-200";
  
  const editorClass = isDarkMode
    ? "bg-[#1e1e1e]"
    : "bg-white border border-gray-200";
  
  const outputClass = isDarkMode
    ? "bg-[#262626] text-white"
    : "bg-gray-100 text-gray-800 border-t border-gray-200";
  
  const selectClass = isDarkMode
    ? "bg-[#262626] text-white"
    : "bg-white text-gray-800 border border-gray-300";

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return {
    isDarkMode,
    toggleDarkMode,
    themeClass,
    headerClass,
    buttonClass,
    sidebarClass,
    editorClass,
    outputClass,
    selectClass
  };
};