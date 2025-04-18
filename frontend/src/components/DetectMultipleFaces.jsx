import { useEffect, useState, useRef } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";
import { AlertTriangle, X } from "lucide-react";

const DetectMultipleFaces = ({ onViolationDetected, isDarkMode = true }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [warningCount, setWarningCount] = useState(0);
  const [model, setModel] = useState(null);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  // Load the model once when component mounts
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await blazeface.load();
        setModel(loadedModel);
        console.log("Face detection model loaded successfully");
      } catch (error) {
        console.error("Failed to load face detection model:", error);
      }
    };
    
    loadModel();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Start detection when both model and video stream are ready
  useEffect(() => {
    if (!model || !videoRef.current?.srcObject) return;

    const detectFaces = async () => {
      try {
        const predictions = await model.estimateFaces(videoRef.current, false);
        
        if (predictions && predictions.length >= 2 && !showModal) {
          if (warningCount === 0) {
            setModalMessage("⚠️ Multiple faces detected! Please ensure only one face is present.");
            setShowModal(true);
            setWarningCount(1);
          } else if (warningCount >= 1) {
            setModalMessage("Multiple people detected! This is considered cheating.");
            setShowModal(true);
            setWarningCount((prev) => prev + 1);
            
            if (warningCount >= 2) {
              // Notify parent component about the violation
              onViolationDetected("multiple_faces");
            }
          }
        }
      } catch (error) {
        console.error("Error detecting faces:", error);
      }
    };

    // Run detection every 2 seconds
    intervalRef.current = setInterval(detectFaces, 2000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [model, videoRef.current?.srcObject, warningCount, showModal, onViolationDetected]);

  // Connect the video stream when available
  const connectVideoStream = (stream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  return (
    <>
      {/* Hidden video element for detection */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline
        muted
        className="absolute opacity-0 pointer-events-none"
        style={{ height: "240px", width: "320px" }}
      />
      
      {/* Warning Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} p-6 rounded-lg shadow-lg max-w-md w-full`}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <AlertTriangle className="text-red-500 mr-2" size={24} />
                <h3 className="text-xl font-bold">Warning</h3>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="py-4">{modalMessage}</div>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowModal(false)} 
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetectMultipleFaces;