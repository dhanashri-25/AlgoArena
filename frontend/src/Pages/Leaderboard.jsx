import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";

const Leaderboard = () => {
  const { contestId } = useParams();
  const { isDarkMode } = useTheme();
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRank = async () => {
      try {
        const res = await axios.get(
          `https://algoarena-gp5i.onrender.com/api/contest/leaderboard/${contestId}`
        );
        console.log("Data from backend", res.data);
        setRanks(res.data);
      } catch (error) {
        console.error("Error in leaderboard:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (contestId) fetchRank();
  }, [contestId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className={`animate-pulse font-medium text-lg ${
            isDarkMode ? "text-indigo-300" : "text-indigo-600"
          }`}
        >
          Loading leaderboard...
        </div>
      </div>
    );

  // Custom styling for ranking
  const getRankDisplay = (rank) => {
    const baseClasses =
      "flex items-center justify-center w-8 h-8 rounded-full font-bold";

    if (rank === 1) {
      return (
        <div className={`${baseClasses} bg-yellow-400 text-yellow-800`}>1</div>
      );
    } else if (rank === 2) {
      return (
        <div className={`${baseClasses} bg-gray-300 text-gray-700`}>2</div>
      );
    } else if (rank === 3) {
      return (
        <div className={`${baseClasses} bg-amber-600 text-amber-100`}>3</div>
      );
    } else {
      return (
        <div
          className={`${baseClasses} ${
            isDarkMode
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {rank}
        </div>
      );
    }
  };

  return (
    <div
      className={`max-w-3xl mx-auto mt-8 p-6 rounded-xl shadow-lg ${
        isDarkMode
          ? "bg-gray-800 bg-opacity-90 shadow-gray-900/40"
          : "bg-white shadow-gray-200"
      }`}
    >
      <div className="mb-8 text-center">
        <h2
          className={`text-3xl font-bold ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          🏆 Contest Leaderboard
        </h2>
        <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Top performers in this challenge
        </p>
      </div>

      <div className="overflow-hidden rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
              <th
                className={`p-4 text-left font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Rank
              </th>
              <th
                className={`p-4 text-left font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Participant
              </th>
              <th
                className={`p-4 text-left font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Score
              </th>
              <th
                className={`p-4 text-left font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Time (s)
              </th>
            </tr>
          </thead>
          <tbody>
            {ranks.map((rank, index) => (
              <tr
                key={index}
                className={`${
                  isDarkMode
                    ? "border-b border-gray-700 hover:bg-gray-700/50"
                    : "border-b border-gray-100 hover:bg-gray-50"
                } transition-all duration-200`}
              >
                <td className="p-4">{getRankDisplay(rank.rank)}</td>
                <td
                  className={`p-4 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {rank.profilePic ? (
                      <img
                        src={rank.profilePic}
                        alt="profile"
                        className="w-10 h-10 rounded-full border-2 object-cover shadow-sm
                        ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium shadow-sm
                        ${
                          isDarkMode
                            ? "bg-gray-600 text-gray-200 border border-gray-500"
                            : "bg-gray-200 text-gray-700 border border-gray-300"
                        }`}
                      >
                        {rank.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{rank.username}</p>
                    </div>
                  </div>
                </td>
                <td
                  className={`p-4 font-medium ${
                    isDarkMode ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  {rank.score}
                </td>
                <td
                  className={`p-4 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {rank.totalTime}s
                </td>
              </tr>
            ))}
            {ranks.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className={`p-8 text-center ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No participants in the leaderboard yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
