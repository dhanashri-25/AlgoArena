import React from "react";

const mockQuestions = [
  {
    id: 1,
    title: "Two Sum",
    status: "solved", // or "unsolved"
    acceptance: "55.1%",
    difficulty: "Easy",
    solutionAvailable: true,
  },
  {
    id: 2,
    title: "Add Two Numbers",
    status: "solved",
    acceptance: "45.5%",
    difficulty: "Medium",
    solutionAvailable: true,
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    status: "solved",
    acceptance: "36.4%",
    difficulty: "Medium",
    solutionAvailable: true,
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    status: "unsolved",
    acceptance: "43.0%",
    difficulty: "Hard",
    solutionAvailable: true,
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    status: "solved",
    acceptance: "35.3%",
    difficulty: "Medium",
    solutionAvailable: true,
  },
  {
    id: 6,
    title: "Zigzag Conversion",
    status: "unsolved",
    acceptance: "50.9%",
    difficulty: "Medium",
    solutionAvailable: false,
  },
  // ...add more
];

const PracticePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 mb-4">
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
            {mockQuestions.map((q) => (
              <tr key={q.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {q.status === "solved" ? (
                    <span className="text-green-600">&#10003;</span>
                  ) : (
                    <span className="text-gray-400">&#9675;</span>
                  )}
                </td>
                <td className="p-3 text-blue-600">
                  {q.id}. {q.title}
                </td>
                <td className="p-3">
                  {q.solutionAvailable ? (
                    <span className="text-purple-500">&#128196;</span>
                  ) : (
                    <span className="text-gray-400">&#128196;</span>
                  )}
                </td>
                <td className="p-3">{q.acceptance}</td>
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
