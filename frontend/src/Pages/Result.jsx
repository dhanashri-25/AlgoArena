import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CheckCircle,
  Clock,
  Clock3,
  Code,
  FileCode2,
  ListChecks,
  Shield,
  Tag,
  Trophy,
  XCircle,
  User,
  Award,
} from "lucide-react";
import { useAuthContext } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext"; // Assumes your theme hook exists

const ResultPage = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, data: userData } = useAuthContext();
  const { isDarkMode } = useTheme();

  const [contestData, setContestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionType, setQuestionType] = useState(null); // 'solved' or 'unsolved'
  const [selectedTab, setSelectedTab] = useState("solved"); // For the question list tabs

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/contest/${contestId}/results`,
          { withCredentials: true }
        );
        console.log("Contest results data:", res.data);
        setContestData(res.data);

        // Default selection if solved questions exist, else unsolved if available
        if (res.data?.result?.[0]?.questionSubmissionTimes?.length > 0) {
          setSelectedQuestion(
            res.data.result[0].questionSubmissionTimes[0].questionId
          );
          setQuestionType("solved");
          setSelectedTab("solved");
        } else if (res.data?.unsolvedQuestions?.length > 0) {
          setSelectedQuestion(res.data.unsolvedQuestions[0]);
          setQuestionType("unsolved");
          setSelectedTab("unsolved");
        }
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to load contest results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [contestId, isLoggedIn, userData]);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateTimeTaken = (startTime, submissionTime) => {
    const start = new Date(startTime);
    const end = new Date(submissionTime || new Date());
    const diffMs = end - start;

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`;
  };

  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return "bg-gray-100 text-gray-800";

    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex justify-center items-center ${
          isDarkMode ? "bg-gray-900" : "bg-slate-50"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <div
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-slate-700"
            }`}
          >
            Loading contest results...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex justify-center items-center ${
          isDarkMode ? "bg-gray-900" : "bg-slate-50"
        }`}
      >
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-lg p-6 max-w-md w-full`}
        >
          <div className="flex items-center justify-center gap-3 text-red-600 mb-4">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-bold">Error</h2>
          </div>
          <p
            className={`text-center ${
              isDarkMode ? "text-gray-300" : "text-slate-700"
            }`}
          >
            {error}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const userContestInfo = contestData?.result?.[0] || {};
  const solvedQuestionsInfo = userContestInfo.questionSubmissionTimes || [];
  const unsolvedQuestionsInfo = contestData?.unsolvedQuestions || [];
  const contestStartTime = userContestInfo.startTime;

  // Helper function to find the submission time for a question
  const getSubmissionTime = (questionId) => {
    const question = solvedQuestionsInfo.find(
      (q) => q.questionId._id === questionId
    );
    return question?.submissionTime;
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-slate-50"
      } px-4 py-8 md:px-8`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`mr-4 ${
              isDarkMode
                ? "text-gray-300 hover:text-blue-400"
                : "text-slate-600 hover:text-blue-600"
            } transition-colors`}
          >
            <ArrowLeft size={20} />
          </button>
          <h1
            className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
              isDarkMode ? "text-white" : "text-slate-800"
            }`}
          >
            <Trophy className="text-yellow-500" size={28} />
            Contest Results
          </h1>
        </div>

        {/* Your Performance Card */}
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-md overflow-hidden mb-8`}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-white text-xl font-semibold flex items-center gap-2">
              <User size={20} />
              Your Performance
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className={`flex flex-col items-center p-4 ${
                  isDarkMode ? "bg-blue-900" : "bg-blue-50"
                } rounded-lg`}
              >
                <Award
                  className="mb-2"
                  size={32}
                  color={isDarkMode ? "#60a5fa" : "#2563eb"}
                />
                <div
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  {userContestInfo.score || 0}
                </div>
                <div className="text-sm text-slate-600">Total Score</div>
              </div>
              <div
                className={`flex flex-col items-center p-4 ${
                  isDarkMode ? "bg-green-900" : "bg-green-50"
                } rounded-lg`}
              >
                <CheckCircle
                  className="mb-2"
                  size={32}
                  color={isDarkMode ? "#34d399" : "#16a34a"}
                />
                <div
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  {userContestInfo.solvedQuestions?.length || 0}
                </div>
                <div className="text-sm text-slate-600">Problems Solved</div>
              </div>
              <div
                className={`flex flex-col items-center p-4 ${
                  isDarkMode ? "bg-purple-900" : "bg-purple-50"
                } rounded-lg`}
              >
                <Clock
                  className="mb-2"
                  size={32}
                  color={isDarkMode ? "#a78bfa" : "#9333ea"}
                />
                <div
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  {userContestInfo.totalTime || "0"}
                </div>
                <div className="text-sm text-slate-600">
                  Total Time (seconds)
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="flex flex-wrap gap-2 text-sm">
                <div
                  className={`flex items-center gap-1 ${
                    isDarkMode ? "text-gray-300" : "text-slate-700"
                  }`}
                >
                  <CalendarClock size={16} className="text-slate-500" />
                  <span>Contest Start: {formatTime(contestStartTime)}</span>
                </div>
                <div className="flex items-center gap-1 ml-auto text-slate-500">
                  <Shield size={16} />
                  <span>Contest ID: {userContestInfo.contest}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tabs & List */}
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-md overflow-hidden`}
          >
            <div
              className={`px-6 py-4 ${
                isDarkMode ? "bg-gray-700" : "bg-slate-800"
              }`}
            >
              <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                <ListChecks size={20} />
                Contest Questions
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setSelectedTab("solved")}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  selectedTab === "solved"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Solved ({solvedQuestionsInfo.length})
              </button>
              <button
                onClick={() => setSelectedTab("unsolved")}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  selectedTab === "unsolved"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Unsolved ({unsolvedQuestionsInfo.length})
              </button>
            </div>

            {/* Conditionally Render the List Based on the Selected Tab */}
            <div className="p-2">
              {selectedTab === "solved" ? (
                solvedQuestionsInfo.length > 0 ? (
                  <div className="space-y-2">
                    {solvedQuestionsInfo.map((question, idx) => (
                      <button
                        key={question.questionId._id}
                        onClick={() => {
                          setSelectedQuestion(question.questionId);
                          setQuestionType("solved");
                        }}
                        className={`w-full text-left p-4 rounded-lg transition-colors ${
                          selectedQuestion?._id === question.questionId._id &&
                          questionType === "solved"
                            ? "bg-blue-50 border-l-4 border-blue-600"
                            : isDarkMode
                            ? "hover:bg-gray-700 border-l-4 border-transparent"
                            : "hover:bg-slate-50 border-l-4 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                              isDarkMode
                                ? "bg-slate-600 text-white"
                                : "bg-slate-800 text-white"
                            }`}
                          >
                            {question.questionId.quesNo || idx + 1}
                          </div>
                          <div className="flex-1 truncate text-sm font-medium">
                            {question.questionId.title}
                          </div>
                          <div
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(
                              question.questionId.difficulty
                            )}`}
                          >
                            {question.questionId.difficulty}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-xs">
                          <div className="flex items-center gap-1">
                            <Trophy size={14} />
                            <span>{question.questionId.points} pts</span>
                          </div>
                          <div className="ml-auto flex items-center gap-1 text-green-600">
                            <CheckCircle size={14} />
                            <span>Solved</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-500">
                    No solved questions
                  </div>
                )
              ) : unsolvedQuestionsInfo.length > 0 ? (
                <div className="space-y-2">
                  {unsolvedQuestionsInfo.map((question, idx) => (
                    <button
                      key={question._id}
                      onClick={() => {
                        setSelectedQuestion(question);
                        setQuestionType("unsolved");
                      }}
                      className={`w-full text-left p-4 rounded-lg transition-colors ${
                        selectedQuestion?._id === question._id &&
                        questionType === "unsolved"
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : isDarkMode
                          ? "hover:bg-gray-700 border-l-4 border-transparent"
                          : "hover:bg-slate-50 border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                            isDarkMode
                              ? "bg-slate-600 text-white"
                              : "bg-slate-800 text-white"
                          }`}
                        >
                          {question.quesNo || idx + 1}
                        </div>
                        <div className="flex-1 truncate text-sm font-medium">
                          {question.title}
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(
                            question.difficulty
                          )}`}
                        >
                          {question.difficulty}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-xs">
                        <div className="flex items-center gap-1">
                          <Trophy size={14} />
                          <span>{question.points} pts</span>
                        </div>
                        <div className="ml-auto flex items-center gap-1 text-red-500">
                          <XCircle size={14} />
                          <span>Not Solved</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-500">
                  No unsolved questions
                </div>
              )}
            </div>
          </div>

          {/* Question Details */}
          <div className="lg:col-span-2">
            {selectedQuestion ? (
              <div
                className={`${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-md overflow-hidden`}
              >
                <div
                  className={`px-6 py-4 ${
                    questionType === "solved"
                      ? isDarkMode
                        ? "bg-gradient-to-r from-green-700 to-green-900"
                        : "bg-gradient-to-r from-green-600 to-green-700"
                      : isDarkMode
                      ? "bg-gradient-to-r from-gray-700 to-gray-900"
                      : "bg-gradient-to-r from-slate-700 to-slate-800"
                  }`}
                >
                  <h2 className="text-white text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCode2 size={20} />
                      <span>{selectedQuestion.title}</span>
                    </div>
                    <div
                      className={`text-xs px-3 py-1 rounded-full font-medium ${getDifficultyColor(
                        selectedQuestion.difficulty
                      )}`}
                    >
                      {selectedQuestion.difficulty}
                    </div>
                  </h2>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h3
                      className={`text-lg font-semibold mb-3 ${
                        isDarkMode ? "text-white" : "text-slate-800"
                      }`}
                    >
                      Problem
                    </h3>
                    <div className="prose max-w-none">
                      <p
                        className={
                          isDarkMode ? "text-gray-300" : "text-slate-700"
                        }
                      >
                        {selectedQuestion.description}
                      </p>
                    </div>
                  </div>
                  {selectedQuestion.constraints && (
                    <div className="mb-6">
                      <h3
                        className={`text-lg font-semibold mb-3 flex items-center gap-2 ${
                          isDarkMode ? "text-white" : "text-slate-800"
                        }`}
                      >
                        <Shield size={18} />
                        Constraints
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedQuestion.constraints.map((constraint, idx) => (
                          <li
                            key={idx}
                            className={
                              isDarkMode ? "text-gray-300" : "text-slate-700"
                            }
                          >
                            {constraint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedQuestion.tags &&
                    selectedQuestion.tags.length > 0 && (
                      <div className="mb-6">
                        <h3
                          className={`text-lg font-semibold mb-3 flex items-center gap-2 ${
                            isDarkMode ? "text-white" : "text-slate-800"
                          }`}
                        >
                          <Tag size={18} />
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedQuestion.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 rounded-full text-sm ${
                                isDarkMode
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div
                      className={`rounded-lg p-4 ${
                        isDarkMode ? "bg-gray-700" : "bg-blue-50"
                      }`}
                    >
                      <div
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-slate-600"
                        }`}
                      >
                        Points
                      </div>
                      <div
                        className={`text-2xl font-bold flex items-center gap-2 ${
                          isDarkMode ? "text-white" : "text-slate-800"
                        }`}
                      >
                        <Trophy size={20} className="text-yellow-500" />
                        {questionType === "solved"
                          ? selectedQuestion.points
                          : "0"}
                      </div>
                    </div>
                    <div
                      className={`rounded-lg p-4 ${
                        questionType === "solved"
                          ? isDarkMode
                            ? "bg-green-700"
                            : "bg-green-50"
                          : isDarkMode
                          ? "bg-red-700"
                          : "bg-red-50"
                      }`}
                    >
                      <div
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-slate-600"
                        }`}
                      >
                        Status
                      </div>
                      <div
                        className={`text-2xl font-bold flex items-center gap-2 ${
                          questionType === "solved"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {questionType === "solved" ? (
                          <>
                            <CheckCircle size={20} />
                            Solved
                          </>
                        ) : (
                          <>
                            <XCircle size={20} />
                            Not Solved
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-6">
                    <h3
                      className={`text-lg font-semibold mb-3 flex items-center gap-2 ${
                        isDarkMode ? "text-white" : "text-slate-800"
                      }`}
                    >
                      <Clock3 size={18} />
                      Timing Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {questionType === "solved" ? (
                        <div
                          className={`rounded-lg p-4 ${
                            isDarkMode ? "bg-gray-700" : "bg-slate-50"
                          }`}
                        >
                          <div
                            className={`text-sm ${
                              isDarkMode ? "text-gray-300" : "text-slate-600"
                            }`}
                          >
                            Time to Solve
                          </div>
                          <div
                            className={`text-xl font-semibold ${
                              isDarkMode ? "text-white" : "text-slate-800"
                            }`}
                          >
                            {calculateTimeTaken(
                              contestStartTime,
                              getSubmissionTime(selectedQuestion._id)
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`rounded-lg p-4 ${
                            isDarkMode ? "bg-gray-700" : "bg-slate-50"
                          }`}
                        >
                          <div
                            className={`text-sm ${
                              isDarkMode ? "text-gray-300" : "text-slate-600"
                            }`}
                          >
                            Status
                          </div>
                          <div className="text-xl font-semibold text-red-500">
                            Not Attempted
                          </div>
                        </div>
                      )}
                      <div
                        className={`rounded-lg p-4 ${
                          isDarkMode ? "bg-gray-700" : "bg-slate-50"
                        }`}
                      >
                        <div
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-slate-600"
                          }`}
                        >
                          Contest Start Time
                        </div>
                        <div
                          className={`text-xl font-semibold ${
                            isDarkMode ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {formatTime(contestStartTime)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {questionType === "unsolved" && (
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() =>
                          navigate(
                            `/contest/${contestId}/solve/${selectedQuestion._id}`
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md flex items-center gap-2 transition-colors"
                      >
                        <Code size={18} />
                        Try solving this problem
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-md p-8 flex flex-col items-center justify-center min-h-[400px] ${
                  isDarkMode ? "text-gray-300" : "text-slate-500"
                }`}
              >
                <FileCode2 size={48} className="mb-4 opacity-30" />
                <p>Select a question to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
