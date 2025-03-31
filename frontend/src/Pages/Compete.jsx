import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CompetePage = () => {
  const [ongoingContests, setOngoingContests] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const [ongoingResponse, upcomingResponse, pastResponse] =
          await Promise.all([
            axios.get("http://localhost:5000/api/current"),
            axios.get("http://localhost:5000/api/upcoming"),
            axios.get("http://localhost:5000/api/completed"),
          ]);

        setOngoingContests(ongoingResponse.data);
        setUpcomingContests(upcomingResponse.data);
        setPastContests(pastResponse.data);
      } catch (err) {
        setError("Failed to fetch contest data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const renderContests = (contests, status) => {
    if (contests.length === 0) {
      return (
        <p className="text-gray-500">No {status} contests at the moment.</p>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map((contest) => (
          <div
            key={contest._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col md:flex-row justify-between items-center p-3 w-full"
          >
            <div className="p-4">
              <h3 className="text-xl font-semibold py-3">
                Contest #{contest.contestNumber}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(contest.contestDate).toLocaleString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZoneName: "short",
                })}
              </p>
              <p className="mt-2 text-[#4B7ABD] font-medium capitalize">
                {status === "ongoing"
                  ? "Ongoing • Ends soon"
                  : status === "upcoming"
                  ? "Starts soon"
                  : "Ended"}
              </p>
            </div>
            {status !== "past" && (
              <Link
                className="p-4 border rounded-md hover:bg-[#6C7993] text-white text-lg bg-black mt-3 md:mt-0 text-center"
                to="/rules"
                state={{contest}}
              >
                Register now
              </Link>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <p className="text-center">Loading contests...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow shadow-gray-200 z-10 relative">
      {/* Header Section */}
      <div className="bg-[#6C7993] dark:bg-[#243B55] text-white py-12 px-6 text-center flex flex-col justify-center h-[200px] sm:h-[250px] md:h-[220px]">
        <h1 className="text-4xl sm:text-5xl font-bold">Contestify Contests</h1>
        <p className="mt-2 text-lg sm:text-xl">
          Compete every week. Sharpen your skills and climb the ranks!
        </p>
      </div>
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8">
        {/* Ongoing Contests Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Ongoing Contests</h2>
          {renderContests(ongoingContests, "ongoing")}
        </section>

        {/* Upcoming Contests Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Upcoming Contests</h2>
          {renderContests(upcomingContests, "upcoming")}
        </section>

        {/* Past Contests Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Past Contests</h2>
          {renderContests(pastContests, "past")}
        </section>
      </div>
    </div>
  );
};

export default CompetePage;
