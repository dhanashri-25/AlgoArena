import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../Context/ThemeContext";
import {
  FaUser,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaLink,
} from "react-icons/fa";
import { BiLinkExternal } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsCodeSlash, BsFillPatchCheckFill } from "react-icons/bs";
import { MdEmojiEvents } from "react-icons/md";

const Profile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  // Stats sections
  const [solvedStats, setSolvedStats] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  // Calculate the user's rank (placeholder logic)
  const calculateRank = (problemCount) => {
    return Math.max(1, 100000 - problemCount * 500);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        console.log("Fetching user data for id:", id);
        const res = await axios.get(
          `https://algoarena-gp5i.onrender.com/api/profile/${id}`
        );

        // Set user data from response
        setUserData(res.data.userdata);

        // Set problem stats from backend data
        if (res.data.userdata.problemStats) {
          setSolvedStats(res.data.userdata.problemStats);
        } else {
          // Fallback if backend doesn't provide stats directly
          const stats = {
            easy:
              res.data.userdata.problemSolved.filter(
                (p) => p.difficulty.toLowerCase() === "easy"
              ).length || 0,
            medium:
              res.data.userdata.problemSolved.filter(
                (p) => p.difficulty.toLowerCase() === "medium"
              ).length || 0,
            hard:
              res.data.userdata.problemSolved.filter(
                (p) => p.difficulty.toLowerCase() === "hard"
              ).length || 0,
          };
          setSolvedStats(stats);
        }

        setLoading(false);
      } catch (error) {
        console.log(
          "Error in fetching user data:",
          error.response?.data || error.message
        );
        setError("Failed to load user profile");
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    } else {
      setError("No user ID provided");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="flex flex-col items-center">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-purple-600 mb-4" />
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="p-6 max-w-md mx-auto bg-red-100 text-red-700 rounded-lg shadow-md">
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="p-6 max-w-md mx-auto bg-yellow-100 text-yellow-700 rounded-lg shadow-md">
          <p className="font-semibold">User not found</p>
        </div>
      </div>
    );
  }

  // Total problems solved
  const totalSolved = solvedStats.easy + solvedStats.medium + solvedStats.hard;

  // Calculate rank based on total problems
  const userRank = calculateRank(totalSolved);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        {/* Header Section */}
        <div
          className={`w-full mb-8 rounded-xl overflow-hidden shadow-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div
            className="h-40 bg-gradient-to-r from-purple-600 to-blue-500"
            style={{ backgroundColor: "#312C85" }}
          ></div>
          <div className="relative px-6 py-6 sm:px-8 sm:py-8">
            <div className="absolute -top-16 left-6 sm:left-8">
              <div
                className={`h-32 w-32 rounded-full border-4 ${
                  isDarkMode ? "border-gray-800" : "border-white"
                } overflow-hidden flex items-center justify-center bg-white`}
              >
                {userData.profilePic ? (
                  <img
                    src={userData.profilePic}
                    alt={userData.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={`h-full w-full flex items-center justify-center ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <FaUser size={64} />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-16 sm:mt-0 sm:ml-40 flex flex-col sm:flex-row sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {userData.name || userData.username}
                </h1>
                <p
                  className={`text-sm sm:text-base ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {userData.email}
                </p>
                <p
                  className={`mt-1 text-sm ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  Rank{" "}
                  <span className="font-semibold">
                    {userRank.toLocaleString()}
                  </span>
                </p>
              </div>

              <div className="mt-4 sm:mt-0">
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 border"
                  style={{
                    backgroundColor: isDarkMode ? "#312C8530" : "#312C8510",
                    color: "#312C85",
                    borderColor: "#312C8550",
                  }}
                >
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Social links */}
            {userData.socialLinks && userData.socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {userData.socialLinks.map((link, index) => {
                  // Determine icon based on URL
                  let icon = <FaLink />;
                  try {
                    const url = new URL(link);
                    if (url.hostname.includes("github")) icon = <FaGithub />;
                    else if (url.hostname.includes("linkedin"))
                      icon = <FaLinkedin />;
                    else if (url.hostname.includes("twitter"))
                      icon = <FaTwitter />;

                    return (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                          isDarkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        } transition-colors duration-200`}
                      >
                        {icon}
                        <span>{url.hostname.replace("www.", "")}</span>
                        <BiLinkExternal size={12} />
                      </a>
                    );
                  } catch (error) {
                    console.log("Invalid URL:", link);
                    return null;
                  }
                })}
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Problems Solved Stats */}
          <div
            className={`col-span-1 md:col-span-2 rounded-xl shadow-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-6`}
          >
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <BsCodeSlash className="mr-2" style={{ color: "#312C85" }} />
              Problems Solved
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className={`rounded-lg p-4 ${
                  isDarkMode ? "bg-gray-700" : "bg-green-50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-green-500">Easy</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode
                        ? "bg-gray-800 text-green-400"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {((solvedStats.easy / totalSolved) * 100 || 0).toFixed(0)}%
                  </span>
                </div>
                <p className="text-2xl font-bold">{solvedStats.easy}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{
                      width: `${(solvedStats.easy / totalSolved) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div
                className={`rounded-lg p-4 ${
                  isDarkMode ? "bg-gray-700" : "bg-yellow-50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-yellow-500">Medium</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode
                        ? "bg-gray-800 text-yellow-400"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {((solvedStats.medium / totalSolved) * 100 || 0).toFixed(0)}
                    %
                  </span>
                </div>
                <p className="text-2xl font-bold">{solvedStats.medium}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (solvedStats.medium / totalSolved) * 100 || 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div
                className={`rounded-lg p-4 ${
                  isDarkMode ? "bg-gray-700" : "bg-red-50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-red-500">Hard</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode
                        ? "bg-gray-800 text-red-400"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {((solvedStats.hard / totalSolved) * 100 || 0).toFixed(0)}%
                  </span>
                </div>
                <p className="text-2xl font-bold">{solvedStats.hard}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{
                      width: `${(solvedStats.hard / totalSolved) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Progress Circle */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative h-24 w-24">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className={isDarkMode ? "text-gray-700" : "text-gray-200"}
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-purple-600"
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={
                        2 * Math.PI * 40 * (1 - totalSolved / 500)
                      }
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{totalSolved}</span>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold">Total Problems</p>
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                    Out of estimated 500
                  </p>
                </div>
              </div>

              <div
                className={`mt-4 sm:mt-0 px-4 py-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-purple-50"
                }`}
              ></div>
            </div>
          </div>

          {/* Contests Participated */}
          <div
            className={`rounded-xl shadow-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-6`}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <MdEmojiEvents className="mr-2" style={{ color: "#312C85" }} />
              Contests
            </h2>

            {userData.contests && userData.contests.length > 0 ? (
              <div className="space-y-4">
                {userData.contests.slice(0, 3).map((contest, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-50 hover:bg-gray-100"
                    } transition-colors duration-200`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">
                        {contest.name || `Contest #${idx + 1}`}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode
                            ? "bg-purple-900 text-purple-200"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {contest.rank || "Participated"}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {contest.date || "Recent"}
                      {contest.score && ` - Score: ${contest.score}`}
                    </p>
                  </div>
                ))}

                {userData.contests.length > 3 && (
                  <a
                    href="#"
                    className={`block text-center py-2 text-sm ${
                      isDarkMode
                        ? "text-purple-400 hover:text-purple-300"
                        : "text-purple-600 hover:text-purple-700"
                    }`}
                  >
                    View all {userData.contests.length} contests
                  </a>
                )}
              </div>
            ) : (
              <div
                className={`flex flex-col items-center justify-center h-40 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <MdEmojiEvents size={32} className="mb-2 opacity-50" />
                <p className="text-sm">No contests participated yet</p>
                <a
                  href="#"
                  className={`mt-2 text-sm ${
                    isDarkMode
                      ? "text-purple-400 hover:text-purple-300"
                      : "text-purple-600 hover:text-purple-700"
                  }`}
                >
                  Browse upcoming contests
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Recent Problems Solved */}
        <div
          className={`rounded-xl shadow-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <BsCodeSlash className="mr-2" style={{ color: "#312C85" }} />
              Recent Problems Solved
            </h2>
            <a
              href="#"
              className={`text-sm ${
                isDarkMode
                  ? "text-purple-400 hover:text-purple-300"
                  : "text-purple-600 hover:text-purple-700"
              } flex items-center`}
            >
              View all <BiLinkExternal className="ml-1" />
            </a>
          </div>

          {userData.problemSolved && userData.problemSolved.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`text-left ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <th className="pb-3 pl-4 font-medium text-sm">Problem</th>
                    <th className="pb-3 font-medium text-sm">Difficulty</th>
                    <th className="pb-3 pr-4 font-medium text-sm">
                      Date Solved
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userData.problemSolved.slice(0, 8).map((problem, idx) => {
                    // Normalize difficulty case for consistent coloring
                    const difficulty =
                      problem.difficulty?.toLowerCase() || "medium";

                    // Determine difficulty color
                    let difficultyColor = "";
                    let bgColor = "";

                    if (difficulty === "easy") {
                      difficultyColor = isDarkMode
                        ? "text-green-400"
                        : "text-green-600";
                      bgColor = isDarkMode ? "bg-green-900" : "bg-green-100";
                    } else if (difficulty === "medium") {
                      difficultyColor = isDarkMode
                        ? "text-yellow-400"
                        : "text-yellow-600";
                      bgColor = isDarkMode ? "bg-yellow-900" : "bg-yellow-100";
                    } else {
                      difficultyColor = isDarkMode
                        ? "text-red-400"
                        : "text-red-600";
                      bgColor = isDarkMode ? "bg-red-900" : "bg-red-100";
                    }

                    return (
                      <tr
                        key={problem._id || idx}
                        className={`${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                        } transition-colors duration-200`}
                      >
                        <td className="py-3 pl-4">
                          <a
                            href={`/problem/${problem.quesNo}`}
                            className={`font-medium ${
                              isDarkMode
                                ? "hover:text-purple-400"
                                : "hover:text-purple-600"
                            }`}
                          >
                            {problem.title ||
                              `Problem #${problem.quesNo || idx + 1}`}
                          </a>
                          {problem.tags && problem.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {problem.tags.slice(0, 2).map((tag, tagIdx) => (
                                <span
                                  key={tagIdx}
                                  className={`text-xs px-1.5 py-0.5 rounded ${
                                    isDarkMode
                                      ? "bg-gray-600 text-gray-300"
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${difficultyColor} ${bgColor}`}
                          >
                            {difficulty.charAt(0).toUpperCase() +
                              difficulty.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-sm">
                          <span
                            className={
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            {new Date(
                              problem.createdAt || Date.now()
                            ).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className={`flex flex-col items-center justify-center h-40 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <BsCodeSlash size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No problems solved yet</p>
              <a
                href="/problems"
                className={`mt-2 text-sm ${
                  isDarkMode
                    ? "text-purple-400 hover:text-purple-300"
                    : "text-purple-600 hover:text-purple-700"
                }`}
              >
                Browse problems
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
