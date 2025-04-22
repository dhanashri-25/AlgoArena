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
  // Global paste prevention when the editor is focused
  useEffect(() => {
    const preventPaste = (e) => {
      e.preventDefault();
      return false;
    };

    // Add global paste prevention
    window.addEventListener("paste", preventPaste, true);

    return () => {
      window.removeEventListener("paste", preventPaste, true);
    };
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    // Just disable context menu
    editor.onContextMenu((e) => {
      e.preventDefault();
      return false;
    });
  };

  return (
    <div className={`flex flex-col ${editorClass} h-full`}>
      {/* Rest of the component remains the same */}
      <div className="w-full p-2 flex items-center justify-between">
        <select
          className={`${selectClass} px-4 py-2 rounded-md w-48`}
          value={selectedLang}
          onChange={(e) => {
            setSelectedLang(e.target.value);
            if (selectedProblem?.templateCode) {
              setCode(selectedProblem.templateCode[e.target.value] || "");
            }
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
