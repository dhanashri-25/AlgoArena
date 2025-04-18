import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../Context/ThemeContext";
import { Calendar, Clock, Trophy, ChevronRight } from "lucide-react";

const CompetePage = () => {
  const [ongoingContests, setOngoingContests] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const [ongoingResponse, upcomingResponse, pastResponse] =
          await Promise.all([
            axios.get(
              "https://algoarena-gp5i.onrender.com/api/contests/current"
            ),
            axios.get(
              "https://algoarena-gp5i.onrender.com/api/contests/upcoming"
            ),
            axios.get(
              "https://algoarena-gp5i.onrender.com/api/contests/completed"
            ),
          ]);

        setOngoingContests(ongoingResponse.data);
        setUpcomingContests(upcomingResponse.data);
        setPastContests(pastResponse.data);
        console.log(pastResponse.data);
      } catch (err) {
        setError("Failed to fetch contest data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      day: date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const renderContestCard = (contest, status) => {
    const date = formatDate(contest.contestDate);

    return (
      <div
        key={contest._id}
        className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl border ${
          isDarkMode
            ? "bg-gray-800/60 backdrop-blur-md border-gray-700 hover:border-gray-600"
            : "bg-white border-gray-100 hover:border-gray-300"
        }`}
      >
        <div
          className={`h-2 ${
            status === "ongoing"
              ? "bg-green-500"
              : status === "upcoming"
              ? "bg-[#312C85]"
              : "bg-gray-500"
          }`}
        ></div>

        <div className="p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3
                  className={`text-xl font-semibold tracking-tight ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Contest #{contest.contestNumber}
                </h3>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  <span>{date.day}</span>
                  <span className="mx-2">•</span>
                  <Clock size={14} className="mr-1" />
                  <span>{date.time}</span>
                </div>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow ${
                  status === "ongoing"
                    ? "bg-green-200 text-green-900"
                    : status === "upcoming"
                    ? "bg-indigo-200 text-indigo-900"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {status === "ongoing"
                  ? "Live Now"
                  : status === "upcoming"
                  ? "Upcoming"
                  : "Completed"}
              </div>
            </div>

            <ul
              className={`text-sm space-y-1 mb-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {contest.duration && (
                <li>
                  <strong>Duration:</strong> {contest.duration} hrs
                </li>
              )}
              {contest.difficulty && (
                <li>
                  <strong>Difficulty:</strong> {contest.difficulty}
                </li>
              )}
              {contest.registeredUsers && (
                <li>
                  <strong>Participants:</strong>{" "}
                  {contest.registeredUsers.length}
                </li>
              )}
            </ul>

            <div
              className={`text-sm font-medium mb-4 ${
                status === "ongoing"
                  ? "text-green-600"
                  : status === "upcoming"
                  ? "text-indigo-600"
                  : "text-gray-500"
              }`}
            >
              {status === "ongoing"
                ? "🟢 Contest is live — join now!"
                : status === "upcoming"
                ? "📅 Registration open"
                : "🏁 Contest ended"}
            </div>
          </div>

          <div>
            {status !== "past" ? (
              <Link
                to="/rules"
                state={{ contest: contest }}
                className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
              >
                Register Now
                <ChevronRight size={16} />
              </Link>
            ) : (
              <Link
                to={`/contest/leaderboard/${contest._id}`}
                className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-500 hover:bg-indigo-50 rounded-md transition"
              >
                <Trophy size={16} />
                View Leaderboard
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContests = (contests, status) => {
    if (contests.length === 0) {
      return (
        <div
          className={`rounded-lg p-8 text-center ${
            isDarkMode
              ? "bg-gray-800 text-gray-300"
              : "bg-gray-50 text-gray-500"
          }`}
        >
          <p>No {status} contests at the moment.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map((contest) => renderContestCard(contest, status))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div
          className={`py-12 px-6 text-center ${
            isDarkMode ? "bg-[#1E1E3F]" : "bg-[#312C85]"
          } text-white`}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-center">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
              Compete with the Best
            </span>
          </h1>

          <p className="mt-2 text-lg sm:text-xl">Loading contests...</p>
        </div>
        <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8">
          <div className="animate-pulse">
            {[1, 2, 3].map((section) => (
              <div key={section} className="mb-12">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((card) => (
                    <div
                      key={card}
                      className={`rounded-lg ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      } shadow-md p-5`}
                    >
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-6 w-1/3"></div>
                      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div
          className={`py-12 px-6 text-center ${
            isDarkMode ? "bg-[#1E1E3F]" : "bg-[#312C85]"
          } text-white`}
        >
          <h1 className="text-4xl sm:text-5xl font-bold">Contests</h1>
          <p className="mt-2 text-lg sm:text-xl">Something went wrong</p>
        </div>
        <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-12 text-center">
          <div
            className={`rounded-lg p-8 ${
              isDarkMode
                ? "bg-red-900/20 text-red-200"
                : "bg-red-50 text-red-600"
            }`}
          >
            <p className="text-lg font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-[#E9F0FF] text-gray-800"
      }`}
    >
      <div
        className={`py-16 px-6 text-white ${
          isDarkMode ? "bg-[#312C85]" : "bg-[#312C85]"
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-center">
            AlgoArena Contests
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-center max-w-2xl mx-auto">
            Solve algorithmic challenges, compete with others, and improve your
            problem-solving skills.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{ongoingContests.length}</div>
              <div className="text-sm mt-1">Live Contests</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">
                {upcomingContests.length}
              </div>
              <div className="text-sm mt-1">Coming Soon</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{pastContests.length}</div>
              <div className="text-sm mt-1">Past Contests</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <div className="w-2 h-8 bg-green-500 rounded-full mr-4"></div>
            <h2
              className={`text-3xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Ongoing Contests
            </h2>
          </div>
          {renderContests(ongoingContests, "ongoing")}
        </section>

        <section className="mb-16">
          <div className="flex items-center mb-6">
            <div className="w-2 h-8 bg-[#312C85] rounded-full mr-4"></div>
            <h2
              className={`text-3xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Upcoming Contests
            </h2>
          </div>
          {renderContests(upcomingContests, "upcoming")}
        </section>

        {/* Past Section */}
        <section className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-2 h-8 bg-gray-500 rounded-full mr-4"></div>
            <h2
              className={`text-3xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Past Contests
            </h2>
          </div>
          {renderContests(pastContests, "past")}
        </section>
      </div>
    </div>
  );
};

export default CompetePage;
