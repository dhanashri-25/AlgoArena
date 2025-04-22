import { useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const DetectMobile = ({ videoElement, isDarkMode = true }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [warningCount, setWarningCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const detectMobile = async () => {
      if (!videoElement) return;
      const model = await cocoSsd.load();
      const interval = setInterval(async () => {
        const predictions = await model.detect(videoElement);
        const mobileDetected = predictions.some(
          (pred) =>
            pred.class === "cell phone" ||
            pred.class === "tablet" ||
            pred.class === "mobile phone"
        );
        if (mobileDetected && !showModal) {
          if (warningCount === 0) {
            setModalMessage("⚠ Mobile detected! Please remove your phone before submitting.");
            setShowModal(true);
            setWarningCount(1);
          } else if (warningCount === 1) {
            setModalMessage("Cheating detected: Mobile usage found! Auto-submitting...");
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
    detectMobile();
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

export default DetectMobile;