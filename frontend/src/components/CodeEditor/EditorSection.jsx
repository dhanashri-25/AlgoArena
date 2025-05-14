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
  // Prevent global copy/paste/cut
  useEffect(() => {
    const preventEvent = (e) => {
      e.preventDefault();
      return false;
    };

    window.addEventListener("paste", preventEvent, true);
    window.addEventListener("copy", preventEvent, true);
    window.addEventListener("cut", preventEvent, true);

    return () => {
      window.removeEventListener("paste", preventEvent, true);
      window.removeEventListener("copy", preventEvent, true);
      window.removeEventListener("cut", preventEvent, true);
    };
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    // Disable right-click context menu
    editor.onContextMenu((e) => {
      e.preventDefault();
      return false;
    });

    // Block Ctrl/Cmd+C, Ctrl/Cmd+V, Ctrl/Cmd+X inside Monaco
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {});
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {});
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, () => {});
  };

  return (
    <div className={`flex flex-col ${editorClass} h-full`}>
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
          contextmenu: false,
        }}
      />
    </div>
  );
};

export default EditorSection;
