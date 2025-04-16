// PracticePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";

const PracticePage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/questions/practice"
        );
        setQuestions(response.data);
      } catch (err) {
        setError("Failed to fetch questions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const baseStyles = {
    container: isDarkMode
      ? "min-h-screen bg-gray-900 text-white px-4 py-8"
      : "min-h-screen bg-indigo-50 px-4 py-8",
    card: isDarkMode
      ? "max-w-7xl mx-auto bg-gray-800 rounded-xl shadow-xl px-6 py-8"
      : "max-w-7xl mx-auto bg-white rounded-xl shadow-xl px-6 py-8",
    heading: isDarkMode
      ? "text-3xl font-extrabold mb-10 text-center text-white"
      : "text-3xl font-extrabold mb-10 text-center text-indigo-900",
    select: isDarkMode
      ? "border border-gray-600 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      : "border border-gray-300 bg-white text-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500",
    input: isDarkMode
      ? "w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      : "w-full border border-gray-300 bg-white text-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500",
    tableHeader: isDarkMode ? "bg-gray-700" : "bg-indigo-100",
    tableHeaderText: isDarkMode
      ? "p-4 font-semibold text-gray-200 uppercase tracking-wider"
      : "p-4 font-semibold text-indigo-700 uppercase tracking-wider",
    tableRow: isDarkMode
      ? "border-b border-gray-700 hover:bg-gray-700 transition"
      : "border-b hover:bg-blue-50 transition",
    link: isDarkMode
      ? "text-indigo-400 hover:text-indigo-300 font-semibold"
      : "text-indigo-600 hover:text-indigo-800 font-semibold",
    statusSolved: "text-green-500",
    statusUnsolved: isDarkMode ? "text-gray-400" : "text-gray-500",
    difficultyEasy: "text-green-500 font-semibold",
    difficultyMedium: isDarkMode
      ? "text-yellow-400 font-semibold"
      : "text-yellow-600 font-semibold",
    difficultyHard: "text-red-500 font-semibold",
  };

  if (loading) {
    return (
      <div className={baseStyles.container}>
        <div className={baseStyles.card}>
          <div className="flex justify-center items-center h-64">
            <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={baseStyles.container}>
        <div className={baseStyles.card}>
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500 font-medium text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={baseStyles.container}>
      <div className={baseStyles.card}>
        <h1 className={baseStyles.heading}>Practice Problems</h1>

        <div className="flex flex-wrap gap-4 mb-8">
          <select className={baseStyles.select}>
            <option>Difficulty</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <select className={baseStyles.select}>
            <option>Status</option>
            <option>Solved</option>
            <option>Unsolved</option>
          </select>
          <select className={baseStyles.select}>
            <option>Tags</option>
            <option>Array</option>
            <option>String</option>
            <option>DP</option>
          </select>
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search questions"
              className={baseStyles.input}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className={baseStyles.tableHeader}>
                <th className={`${baseStyles.tableHeaderText} w-16`}>Status</th>
                <th className={baseStyles.tableHeaderText}>Title</th>
                <th className={baseStyles.tableHeaderText}>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q._id} className={baseStyles.tableRow}>
                  <td className="p-3 text-center">
                    {q.status === "solved" ? (
                      <span className={baseStyles.statusSolved}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 inline"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span className={baseStyles.statusUnsolved}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 inline"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v8m0 0h.01M12 3v3m0 0h.01"
                          />
                        </svg>
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <Link to={`/code/${q._id}`} className={baseStyles.link}>
                      {q.quesNo}. {q.title}
                    </Link>
                  </td>
                  <td className="p-3">
                    {q.difficulty === "Easy" && (
                      <span className={baseStyles.difficultyEasy}>
                        {q.difficulty}
                      </span>
                    )}
                    {q.difficulty === "Medium" && (
                      <span className={baseStyles.difficultyMedium}>
                        {q.difficulty}
                      </span>
                    )}
                    {q.difficulty === "Hard" && (
                      <span className={baseStyles.difficultyHard}>
                        {q.difficulty}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
