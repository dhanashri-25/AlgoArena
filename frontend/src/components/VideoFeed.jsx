import { useEffect, useRef, useState } from "react";

const VideoFeed = ({ onStreamReady }) => {
  const videoRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Start the camera and pass the video element when ready
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        onStreamReady(videoRef.current);
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };

    startCamera();

    // Cleanup: stop the video stream when the component unmounts
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onStreamReady]);

  // Handle dragging events
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      // Update the video element's position based on the mouse movement
      if (videoRef.current) {
        `videoRef.current.style.left = ${e.clientX - offset.x}px`;
        `videoRef.current.style.top = ${e.clientY - offset.y}px`;
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  const handleMouseDown = (e) => {
    if (videoRef.current) {
      // Get the current position of the video element
      const rect = videoRef.current.getBoundingClientRect();
      // Calculate the offset between the mouse click and the element's top-left corner
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.bottom,
      });
      setDragging(true);
    }
  };

  return (
    
    <video
      ref={videoRef}
      autoPlay
      playsInline
      onMouseDown={handleMouseDown}
      style={{
        position: "fixed",
        bottom: "10px", // Using top instead of bottom for easier dragging
        left: "10px",
        cursor: "grab",
        width: "150px",
        height: "120px",
        border: "2px solid black",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
      }}
    ></video>
  );
};

export default VideoFeed;