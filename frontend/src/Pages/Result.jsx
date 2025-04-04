import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ResultPage = () => {
  // Extract contestId from the URL (e.g., /contest/123/results)
  const { contestId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch contest result data from your API using the contestId.
    axios
      .get(`/api/contest/${contestId}/results`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [contestId]);

  if (!data) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading results...
      </div>
    );
  }

  const { contestSummary, questions, leaderboard } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Contest Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-3xl font-bold">{contestSummary.name}</h1>
          <p className="mt-2 text-gray-600">
            Duration: {contestSummary.duration} | Participants:{" "}
            {contestSummary.participants}
          </p>
        </div>

        {/* Question Performance */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">Question Performance</h2>
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Title</th>
                <th className="p-3">Points</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, index) => (
                <tr key={q.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 text-blue-600">{q.title}</td>
                  <td className="p-3">{q.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Username</th>
                <th className="p-3">Problems Solved</th>
                <th className="p-3">Total Time</th>
                <th className="p-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user) => (
                <tr key={user.rank} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.rank}</td>
                  <td className="p-3 flex items-center space-x-2">
                    <img
                      src={user.profilePic || "default-avatar.png"}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-blue-600">{user.username}</span>
                  </td>
                  <td className="p-3">{user.solved}</td>
                  <td className="p-3">{user.totalTime} sec</td>
                  <td className="p-3">{user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
