import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Minimize2, Maximize2 } from "lucide-react";

const VideoFeed = ({ onStreamReady, isDarkMode = true }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [streamActive, setStreamActive] = useState(false);

  // Start the camera and pass the video element when ready
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: "user"
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
          
          // Notify parent component about stream
          if (onStreamReady) {
            onStreamReady(stream);
          }
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setStreamActive(false);
      }
    };

    startCamera();

    // Cleanup: stop the video stream when the component unmounts
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        
        tracks.forEach(track => {
          track.stop();
        });
      }
    };
  }, [onStreamReady]);

  // Handle dragging events
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging || !containerRef.current) return;
      
      // Update position based on mouse movement
      const newLeft = e.clientX - offset.x;
      const newTop = e.clientY - offset.y;
      
      // Get window dimensions
      const maxX = window.innerWidth - containerRef.current.offsetWidth;
      const maxY = window.innerHeight - containerRef.current.offsetHeight;
      
      // Apply boundaries
      containerRef.current.style.left = `${Math.max(0, Math.min(maxX, newLeft))}px`;
      containerRef.current.style.top = `${Math.max(0, Math.min(maxY, newTop))}px`;
    };

    const handleMouseUp = () => {
      setDragging(false);
      document.body.style.userSelect = "auto";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  const handleMouseDown = (e) => {
    // Only enable dragging from the header area
    if (e.target.closest(".video-header") && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setDragging(true);
      document.body.style.userSelect = "none"; // Prevent text selection while dragging
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleActive = () => {
    setIsActive(!isActive);
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getVideoTracks();
      tracks.forEach(track => {
        track.enabled = !isActive;
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} 
                  fixed shadow-lg rounded-lg border overflow-hidden transition-all duration-300 z-30`}
      style={{
        bottom: "20px",
        right: "20px",
        width: isMinimized ? "60px" : "220px",
        height: isMinimized ? "60px" : "200px",
      }}
    >
      {/* Header/Control bar */}
      <div 
        className="video-header flex items-center justify-between px-2 py-1 cursor-move bg-gray-700 text-white"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center">
          {streamActive ? (
            <Camera size={16} className="text-green-400" />
          ) : (
            <CameraOff size={16} className="text-red-400" />
          )}
          {!isMinimized && (
            <span className="ml-2 text-xs">Proctoring Camera</span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={toggleActive} 
            className="p-1 rounded hover:bg-gray-600"
            title={isActive ? "Disable camera" : "Enable camera"}
          >
            {isActive ? (
              <Camera size={14} className="text-green-400" />
            ) : (
              <CameraOff size={14} className="text-red-400" />
            )}
          </button>
          <button 
            onClick={toggleMinimize} 
            className="p-1 rounded hover:bg-gray-600"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? (
              <Maximize2 size={14} />
            ) : (
              <Minimize2 size={14} />
            )}
          </button>
        </div>
      </div>
      
      {/* Video element */}
      <div className={`${isMinimized ? "hidden" : "block"} w-full h-full bg-black`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${!isActive ? "opacity-50" : ""}`}
        ></video>
        
        {/* Camera inactive overlay */}
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white">
            <CameraOff size={24} />
            <span className="ml-2 text-sm">Camera Off</span>
          </div>
        )}
      </div>
      
      {/* Minimized state just shows an icon */}
      {isMinimized && (
        <div className="flex items-center justify-center h-full">
          {isActive ? (
            <Camera size={24} className={isDarkMode ? "text-green-400" : "text-green-600"} />
          ) : (
            <CameraOff size={24} className={isDarkMode ? "text-red-400" : "text-red-600"} />
          )}
        </div>
      )}
    </div>
  );
};

export default VideoFeed;