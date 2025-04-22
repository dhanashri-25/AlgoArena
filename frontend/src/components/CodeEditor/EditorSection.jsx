import React, { useEffect } from "react";
import Editor from "@monaco-editor/react";

const EditorSection = ({
  selectedLang,
  code,
  setCode,
  isDarkMode,
  selectClass,
  editorClass,
  selectedProblem,
  languages,
  setSelectedLang,
}) => {
  const handleEditorDidMount = (editor, monaco) => {
    // Prevent paste operations using a safer approach
    editor.onKeyDown((e) => {
      // Check for Ctrl+V or Command+V
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyV") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });

    // Disable context menu to prevent right-click paste
    editor.onContextMenu((e) => {
      e.preventDefault();
      return false;
    });
  };
  return (
    <div className={`flex flex-col ${editorClass} h-full`}>
      <div className="w-full p-2 flex items-center justify-between">
        <select
          className={`${selectClass} px-4 py-2 rounded-md w-48`}
          value={selectedLang}
          onChange={(e) => {
            setSelectedLang(e.target.value);
            setCode(selectedProblem.templateCode[e.target.value]);
          }}
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>

        <div className="text-sm opacity-70">
          {selectedProblem && `Problem: ${selectedProblem.title}`}
        </div>
      </div>
      <Editor
        height="100%"
        language={selectedLang.toLowerCase()}
        value={code}
        onChange={(value) => setCode(value)}
        theme={isDarkMode ? "vs-dark" : "light"}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          tabSize: 2,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          contextmenu: false, // Disable context menu
        }}
      />
    </div>
  );
};

export default EditorSection;
