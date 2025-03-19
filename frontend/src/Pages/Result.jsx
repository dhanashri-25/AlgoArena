import React from "react";

const ResultPage = () => {
  // Dummy data – replace with your real contest results and leaderboard data
  const contestSummary = {
    name: "Weekly DSA Contest #23",
    duration: "90 minutes",
    participants: 120,
  };

  const questions = [
    { id: 1, title: "Two Sum", timeTaken: "1m 30s", status: "Solved" },
    { id: 2, title: "House Robber", timeTaken: "2m 15s", status: "Solved" },
    { id: 3, title: "Longest Substring", timeTaken: "N/A", status: "Unsolved" },
  ];

  const leaderboard = [
    { rank: 1, username: "user123", solved: 10, totalTime: "15m" },
    { rank: 2, username: "codeMaster", solved: 9, totalTime: "18m" },
    { rank: 3, username: "devGuru", solved: 8, totalTime: "20m" },
  ];

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
                <th className="p-3">Time Taken</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, index) => (
                <tr key={q.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 text-blue-600">{q.title}</td>
                  <td className="p-3">{q.timeTaken}</td>
                  <td className="p-3">
                    {q.status === "Solved" ? (
                      <span className="text-green-600">Solved</span>
                    ) : (
                      <span className="text-red-600">Unsolved</span>
                    )}
                  </td>
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
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user) => (
                <tr key={user.rank} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.rank}</td>
                  <td className="p-3 text-blue-600">{user.username}</td>
                  <td className="p-3">{user.solved}</td>
                  <td className="p-3">{user.totalTime}</td>
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
