// src/utils/antiCheat.js

/**
 * Anti-cheat utilities for preventing copying, pasting, and tab switching
 */

export const preventCopyingProps = {
  style: { 
    userSelect: "none", 
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none"
  },
  onCopy: (e) => e.preventDefault(),
  onCut: (e) => e.preventDefault(),
  onPaste: (e) => e.preventDefault(),
  onContextMenu: (e) => e.preventDefault(),
};

export const attachAntiCheatingListeners = (element) => {
  if (!element) return;
  
  const preventEvents = (e) => {
    e.preventDefault();
    return false;
  };
  
  element.addEventListener('copy', preventEvents);
  element.addEventListener('cut', preventEvents);
  element.addEventListener('paste', preventEvents);
  element.addEventListener('contextmenu', preventEvents);
  
  // Make text non-selectable
  element.style.userSelect = 'none';
  element.style.WebkitUserSelect = 'none';
  element.style.MozUserSelect = 'none';
  element.style.msUserSelect = 'none';
  
  return () => {
    element.removeEventListener('copy', preventEvents);
    element.removeEventListener('cut', preventEvents);
    element.removeEventListener('paste', preventEvents);
    element.removeEventListener('contextmenu', preventEvents);
  };
};

// React Hook for preventing copying
import { useEffect, useRef } from 'react';

export const useAntiCheating = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const cleanup = attachAntiCheatingListeners(containerRef.current);
    
    return cleanup;
  }, []);
  
  return containerRef;
};