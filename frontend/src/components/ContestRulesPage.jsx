import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { toast } from "react-toastify";

const ContestRulesPage = () => {
  const location = useLocation();
  const contest = location.state?.contest;
  const navigate = useNavigate();
  const { data: currentUser, isLoggedIn } = useAuthContext();
  const { isDarkMode } = useTheme();

  const [isRegistered, setIsRegistered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!contest || !currentUser) return;
    const userId = currentUser.id || currentUser._id;
    const registered = contest.registeredUsers?.some(
      (id) => id?.toString() === userId?.toString()
    );
    setIsRegistered(registered);
  }, [contest, currentUser]);

  const DsaContestDetails = [
    {
      title: "Contest Overview",
      content:
        "The DSA Coding Challenge is a 3-hour competitive programming event focusing on data structures and algorithms. Participants will solve 7 problems of varying difficulty levels to test their problem-solving skills and coding efficiency.",
    },
    {
      title: "Eligibility",
      content:
        "Open to all developers and students aged 16+. Individual participation only - team entries are not allowed. Basic programming knowledge and familiarity with any programming language is required.",
    },
  ];

  const rules = [
    {
      title: "Competition Rules",
      content: [
        "Code copy/pasting disabled once contest starts - original solutions only",
        "Auto Submission on disabling camera",
        "Tab switching limit: Maximum 3 times before automatic submission",
        "Scoring: Points based on problem difficulty and submission time",
        "Submission lock: Once submitted, solutions cannot be modified",
        "Network stability: Multiple disconnections may lead to attempt penalties",
      ],
    },
  ];

  const score = [
    {
      title: "Scoring & Ranking",
      content: [
        "Each Question has 25 marks",
        "10% extra points for early submissions",
      ],
    },
  ];

  const handleRegisterClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!isRegistered) {
      setShowModal(true);
    } else {
      toast.info("You are already registered for this contest!");
    }
  };

  const handleConfirmRegister = async () => {
    try {
      const userId = currentUser.id || currentUser._id;
      await axios.post(`http://localhost:5000/api/contests/register`, {
        contestId: contest._id,
        userId: userId,
      });
      toast.success("Registered Successfully!");
      setShowModal(false);
      setIsRegistered(true);
      contest.registeredUsers = contest.registeredUsers
        ? [...contest.registeredUsers, userId]
        : [userId];
    } catch (error) {
      if (error.response?.data?.message === "User already registered") {
        toast.info("You are already registered for this contest!");
        setIsRegistered(true);
      } else {
        toast.error(error.response?.data?.message || "Registration failed");
      }
      setShowModal(false);
    }
  };

  const handleUnregister = async () => {
    try {
      const userId = currentUser.id || currentUser._id;
      await axios.post(`http://localhost:5000/api/contests/unregister`, {
        contestId: contest._id,
        userId: userId,
      });
      toast.info("Unregistered Successfully!");
      setIsRegistered(false);
      contest.registeredUsers = contest.registeredUsers.filter(
        (id) => id.toString() !== userId.toString()
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Unregistration failed");
    }
  };

  const handleGoToContest = () => {
    navigate(`/code/${contest._id}`);
  };

  const themeStyles = {
    container: isDarkMode
      ? "bg-gray-900 text-white min-h-screen p-25"
      : "bg-[#E8F1FF] text-black min-h-screen p-25",
    card: isDarkMode
      ? "bg-gray-800 border-l-4 border-blue-400 text-white"
      : "bg-white border-l-4 border-blue-300 text-black",
    sectionHeading: "text-3xl font-semibold my-4",
    ruleList: isDarkMode ? "bg-gray-700" : "bg-blue-50",
    buttonPrimary: "bg-blue-600 text-white px-4 py-2 rounded-md",
    buttonDanger: "bg-red-600 text-white px-4 py-2 rounded-md",
    buttonNeutral: "bg-gray-400 text-white px-4 py-2 rounded-md",
  };

  return (
    <div className={themeStyles.container } >
      <h1 className="text-5xl font-bold mb-15">
        DSA Coding Challenge  - Rules & Guidelines
      </h1>

      {DsaContestDetails.map((detail, index) => (
        <div
          key={index}
          className={`p-6 my-4 rounded-lg shadow-sm ${themeStyles.card}`}
        >
          <h2 className="text-2xl font-semibold mb-2">{detail.title}</h2>
          <p>{detail.content}</p>
        </div>
      ))}

      {rules.map((section, index) => (
        <div key={index} className="my-4">
          <h2 className={themeStyles.sectionHeading}>{section.title}</h2>
          <ul
            className={`list-disc pl-6 p-4 rounded-lg ${themeStyles.ruleList}`}
          >
            {section.content.map((point, i) => (
              <li key={i} className="my-2">
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {score.map((section, index) => (
        <div key={index}>
          <h2 className={themeStyles.sectionHeading}>{section.title}</h2>
          <ul
            className={`list-disc pl-6 p-4 rounded-lg ${themeStyles.ruleList}`}
          >
            {section.content.map((point, i) => (
              <li key={i} className="my-2">
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="my-8">
        {contest?.status === "current" && (
          <div className="flex gap-4">
            {isRegistered ? (
              <>
                <button
                  className={themeStyles.buttonDanger}
                  onClick={handleUnregister}
                >
                  Unregister
                </button>
                <button
                  className={themeStyles.buttonPrimary}
                  onClick={handleGoToContest}
                >
                  Go to Contest
                </button>
              </>
            ) : (
              <button
                className={themeStyles.buttonPrimary}
                onClick={handleRegisterClick}
              >
                Register
              </button>
            )}
          </div>
        )}

        {contest?.status === "upcoming" && (
          <>
            {isRegistered ? (
              <button
                className={themeStyles.buttonDanger}
                onClick={handleUnregister}
              >
                Unregister
              </button>
            ) : (
              <button
                className={themeStyles.buttonPrimary}
                onClick={handleRegisterClick}
              >
                Register
              </button>
            )}
          </>
        )}
      </div>

      <div className="border border-gray-400 mt-8 rounded-md">
        <h2
          className={`${
            isDarkMode ? "bg-gray-700" : "bg-gray-300"
          } py-2 px-4 font-semibold`}
        >
          Problems List
        </h2>
        
        {contest?.status === "upcoming" ? (
          <p className="p-4">Contest will start soon.</p>
        ) : contest?.questions?.length > 0 ? (
          <ul className="p-4">
            {contest.questions.map((question, index) => (
              <li key={index} className="my-2 p-2">
                {question.title || question}
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4">No problems available.</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              Are you sure you want to register?
            </h2>
            <p className="mb-4">
              If you know you won't be able to attend, be sure to unregister so
              your contest rating won't be negatively affected.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleConfirmRegister}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Register
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={themeStyles.buttonNeutral}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestRulesPage;
