// PracticePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PracticePage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Fetch only questions from completed contests
        const response = await axios.get("http://localhost:5000/api/practice");
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

  if (loading) {
    return <p className="text-center">Loading questions...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Your filter and search elements remain unchanged */}
          <select className="border border-gray-300 rounded px-3 py-2 focus:outline-none">
            <option>Lists</option>
            <option>All Questions</option>
            <option>Favorites</option>
          </select>
          <select className="border border-gray-300 rounded px-3 py-2 focus:outline-none">
            <option>Difficulty</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <select className="border border-gray-300 rounded px-3 py-2 focus:outline-none">
            <option>Status</option>
            <option>Solved</option>
            <option>Unsolved</option>
          </select>
          <select className="border border-gray-300 rounded px-3 py-2 focus:outline-none">
            <option>Tags</option>
            <option>Array</option>
            <option>String</option>
            <option>DP</option>
          </select>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search questions"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
            />
          </div>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded">
            <span className="mr-2">Pick One</span>
          </button>
        </div>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 font-semibold text-gray-600 w-16">Status</th>
              <th className="p-3 font-semibold text-gray-600">Title</th>
              <th className="p-3 font-semibold text-gray-600">Solution</th>
              <th className="p-3 font-semibold text-gray-600">Acceptance</th>
              <th className="p-3 font-semibold text-gray-600">Difficulty</th>
              <th className="p-3 font-semibold text-gray-600">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {q.status === "solved" ? (
                    <span className="text-green-600">&#10003;</span>
                  ) : (
                    <span className="text-gray-400">&#9675;</span>
                  )}
                </td>
                <td className="p-3 text-blue-600">
                  {/* When the user clicks the question, redirect to /code/:id */}
                  <Link to={`/code/${q._id}`}>
                    {q.quesNo}. {q.title}
                  </Link>
                </td>
                <td className="p-3">
                  {q.solutionAvailable ? (
                    <span className="text-purple-500">&#128196;</span>
                  ) : (
                    <span className="text-gray-400">&#128196;</span>
                  )}
                </td>
                <td className="p-3">{q.acceptance || "N/A"}</td>
                <td className="p-3">
                  {q.difficulty === "Easy" && (
                    <span className="text-green-600">{q.difficulty}</span>
                  )}
                  {q.difficulty === "Medium" && (
                    <span className="text-yellow-600">{q.difficulty}</span>
                  )}
                  {q.difficulty === "Hard" && (
                    <span className="text-red-600">{q.difficulty}</span>
                  )}
                </td>
                <td className="p-3 text-gray-400">
                  <span className="text-sm">Locked</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PracticePage;
