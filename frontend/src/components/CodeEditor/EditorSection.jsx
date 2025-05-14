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
  useEffect(() => {
    const preventPaste = (e) => {
      e.preventDefault();
      return false;
    };

    // Add global paste prevention
    window.addEventListener("paste", preventPaste, true);
    window.addEventListener("copy", preventPaste, true);

    return () => {
      window.removeEventListener("paste", preventPaste, true);
      window.removeEventListener("copy", preventPaste, true);
    };
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    // Disable context menu
    editor.onContextMenu((e) => {
      e.preventDefault();
      return false;
    });

    // Disable paste
    editor.onPaste((e) => {
      e.event.preventDefault();
      e.event.stopPropagation();
    });

    // Disable copy
    editor.onKeyDown((e) => {
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyC") {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  };

  return (
    <div className={flex flex-col ${editorClass} h-full}>
      <div className="w-full p-2 flex items-center justify-between">
        <select
          className={${selectClass} px-4 py-2 rounded-md w-48}
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
          {selectedProblem && Problem: ${selectedProblem.title}}
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