import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Leaderboard = () => {
  const { contestId } = useParams();
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRank = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/contest/leaderboard/${contestId}`
        );
        console.log("data from backend", res.data);
        setRanks(res.data);
      } catch (error) {
        console.error("error in leaderboard:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (contestId) fetchRank();
  }, [contestId]);

  if (loading) return <div className="text-center p-4 text-lg">Loading...</div>;

  const getMedalEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">🏆 Leaderboard</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Rank</th>
            <th className="p-2">User</th>
            <th className="p-2">Score</th>
            <th className="p-2">Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {ranks.map((rank, index) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-50 transition duration-200"
            >
              <td className="p-2 font-medium">{getMedalEmoji(rank.rank)}</td>
              <td className="p-2 flex items-center gap-2">
                {rank.profilePic ? (
                  <img
                    src={rank.profilePic}
                    alt="profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                    {rank.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                {rank.username}
              </td>
              <td className="p-2">{rank.score}</td>
              <td className="p-2">{rank.totalTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
