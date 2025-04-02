import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../Context/AuthContext";

const ContestRulesPage = () => {
  const location = useLocation();
  const contest = location.state?.contest;
  const navigate = useNavigate();
  const { data: currentUser, isLoggedIn } = useAuthContext();

  // Local state to track if the user is registered
  const [isRegistered, setIsRegistered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Check registration status on component mount and when contest/currentUser changes
  useEffect(() => {
    if (contest && contest.registeredUsers && currentUser) {
      const registered = contest.registeredUsers.some(
        (id) => id.toString() === currentUser.id.toString()
      );
      setIsRegistered(registered);
    }
  }, [contest, currentUser]);

  useEffect(() => {
    console.log("Current user:", currentUser);
    console.log("Contest details:", contest);
  }, [contest, currentUser]);

  // Contest details and rules remain unchanged
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
        "Code copy /pasting disabled once contest starts - original solutions only",
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

  // Handles registration modal opening
  const handleRegisterClick = () => {
    if (!isLoggedIn) {
      console.log("User not logged in. Redirecting to login.");
      navigate("/login");
      return;
    }
    console.log("User is logged in, showing registration modal.");
    setShowModal(true);
  };

  // Confirm registration API call
  const handleConfirmRegister = async () => {
    try {
      console.log("Confirming registration for contest:", contest._id);
      await axios.post(`http://localhost:5000/api/register`, {
        contestId: contest._id,
        userId: currentUser.id,
      });
      console.log("Registration successful");
      alert("Registered Successfully!");
      setShowModal(false);
      setIsRegistered(true); // Update local registration status
      // Optional: Navigate to contest if contest is current
      // navigate(`/code/${contest._id}`);
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  // Unregister API call
  const handleUnregister = async () => {
    try {
      console.log("Unregistering user from contest:", contest._id);
      await axios.post(`http://localhost:5000/api/unregister`, {
        contestId: contest._id,
        userId: currentUser.id,
      });
      console.log("Unregistration successful");
      alert("Unregistered Successfully!");
      setIsRegistered(false); // Update local registration status
    } catch (error) {
      console.error("Unregistration error:", error);
      alert(error.response?.data?.message || "Unregistration failed");
    }
  };

  // Redirect to contest page with contest id in the route
  const handleGoToContest = () => {
    navigate(`/code/${contest._id}`);
  };

  return (
    <div className="bg-[#E8F1FF] flex min-h-screen flex-col p-20">
      <h1 className="text-5xl font-semibold py-5 mb-5">
        DSA Coding Challenge 2024 - Rules & Guidelines
      </h1>

      {DsaContestDetails.map((detail, index) => (
        <div
          key={index}
          className="bg-white p-8 my-4 rounded-lg border-l-4 border-blue-300"
        >
          <h2 className="text-3xl my-2">{detail.title}</h2>
          <p>{detail.content}</p>
        </div>
      ))}

      {rules.map((detail, index) => (
        <div key={index} className="my-2 flex gap-2 flex-col">
          <h1 className="text-3xl">{detail.title}</h1>
          <ul className="list-disc pl-6 bg-blue-50 my-4 rounded-lg">
            {detail.content.map((point, i) => (
              <li key={i} className="my-2">
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {score.map((detail, index) => (
        <div key={index}>
          <h1 className="text-3xl">{detail.title}</h1>
          <ul className="list-disc pl-6 bg-blue-50 my-4 rounded-lg">
            {detail.content.map((point, i) => (
              <li key={i} className="my-2">
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <br />
      <br />

      {/* Conditional Button Rendering */}
      {contest?.status === "completed" ? (
        <p className="text-red-600 text-xl">Contest Ended</p>
      ) : contest?.status === "current" && isRegistered ? (
        <div className="flex gap-4">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md"
            onClick={handleUnregister}
          >
            Unregister
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={handleGoToContest}
          >
            Go to Contest
          </button>
        </div>
      ) : (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={handleRegisterClick}
        >
          Register
        </button>
      )}

      {/* Problems List */}
      <div className="border border-gray-400 mt-8">
        <h1 className="bg-gray-300 py-2 px-3">Problems List</h1>
        {contest?.status === "upcoming" ? (
          <p className="p-3">Contest will start soon.</p>
        ) : contest?.questions && contest.questions.length > 0 ? (
          <ul className="rounded-lg">
            {contest.questions.map((question, i) => (
              <li key={i} className="my-2 px-3 py-2">
                {question.title || question}
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-3">No problems available.</p>
        )}
      </div>

      {/* Registration Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500/60 bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-xl font-bold mb-4">
              Are you sure you want to register?
            </h2>
            <p className="mb-4">
              If you know you won't be able to attend, be sure to unregister so
              your contest rating won't be negatively affected.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleConfirmRegister}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Register
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
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
