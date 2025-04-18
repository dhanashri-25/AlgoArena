import { useEffect } from "react";

const usePreventCodeCopy = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e) => {
      if (e.target.closest(".editor-container")) {
        e.preventDefault();
        return false;
      }
    };

    // Disable keyboard shortcuts for copy
    const handleKeyDown = (e) => {
      // Check if we're in the editor and if Ctrl+C or Cmd+C is pressed
      if (e.target.closest(".editor-container")) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x')) {
          e.preventDefault();
          return false;
        }
      }
    };

    // Disable selecting text in the editor
    const handleSelectStart = (e) => {
      if (e.target.closest(".editor-container")) {
        // We don't completely prevent selection as it's needed for typing
        // but we can disable browser's native select behavior
        document.getSelection().empty();
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("selectstart", handleSelectStart);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("selectstart", handleSelectStart);
    };
  }, []);
};

export default usePreventCodeCopy;