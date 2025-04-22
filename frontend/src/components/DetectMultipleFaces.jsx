import { useEffect, useState } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const DetectMultipleFaces = ({ videoElement, isDarkMode = true }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [warningCount, setWarningCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const detectFaces = async () => {
      if (!videoElement) return;
      const model = await blazeface.load();
      const interval = setInterval(async () => {
        const predictions = await model.estimateFaces(videoElement, false);
        if (predictions.length >= 2 && !showModal) {
          if (warningCount === 0) {
            setModalMessage("⚠ Multiple faces detected! Please ensure only one face is present before submitting.");
            setShowModal(true);
            setWarningCount(1);
          } else if (warningCount === 1) {
            setModalMessage("Cheating detected: Multiple faces found! Auto-submitting...");
            setShowModal(true);
            setWarningCount(2);
            clearInterval(interval);
            setTimeout(() => {
              navigate("/submit");
            }, 3000);
          }
        }
      }, 2000);
      return () => clearInterval(interval);
    };
    detectFaces();
  }, [videoElement, showModal, warningCount, navigate]);

  const handleProceed = () => {
    navigate("/submit");
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-800"} p-6 rounded-lg shadow-lg max-w-md w-full`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">CodeJudge</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="py-4">{modalMessage}</div>
            {warningCount < 2 && (
              <div className="flex justify-end">
                <button onClick={handleProceed} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Proceed to Submit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DetectMultipleFaces;
