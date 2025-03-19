import React from "react";
import { Link } from "react-router-dom";

const mockContests = {
  ongoing: [
    {
      id: 1,
      title: "Weekly Contest 441",
      dateInfo: "Sunday 8:00 AM GMT+5:30",
      statusText: "Ongoing • Ends in 2h 14m",
    },
    {
      id: 1,
      title: "Weekly Contest 441",
      dateInfo: "Sunday 8:00 AM GMT+5:30",
      statusText: "Ongoing • Ends in 2h 14m",
    },
  ],
  upcoming: [
    {
      id: 2,
      title: "Biweekly Contest 152",
      dateInfo: "Saturday 8:00 PM GMT+5:30",
      statusText: "Starts in 1d 9h 57m",
    },
    {
      id: 2,
      title: "Biweekly Contest 152",
      dateInfo: "Saturday 8:00 PM GMT+5:30",
      statusText: "Starts in 1d 9h 57m",
    },
    {
      id: 2,
      title: "Biweekly Contest 152",
      dateInfo: "Saturday 8:00 PM GMT+5:30",
      statusText: "Starts in 1d 9h 57m",
    },
  ],
  past: [
    {
      id: 3,
      title: "Weekly Contest 439",
      dateInfo: "Ended Mar 2, 2025",
      statusText: "Ended",
    },
    {
      id: 4,
      title: "Weekly Contest 438",
      dateInfo: "Ended Feb 24, 2025",
      statusText: "Ended",
    },
    {
      id: 3,
      title: "Weekly Contest 439",
      dateInfo: "Ended Mar 2, 2025",
      statusText: "Ended",
    },
  ],
};

const CompetePage = () => {
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
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Ongoing Contests</h2>
          {mockContests.ongoing.length === 0 ? (
            <p className="text-gray-500">No ongoing contests at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockContests.ongoing.map((contest) => (
                <div
                  key={contest.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col md:flex-row justify-between items-center p-3 w-full"
                >
                  <div className="p-4">
                    <h3 className="text-xl font-semibold py-3">{contest.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {contest.dateInfo}
                    </p>
                    <p className="mt-2 text-[#4B7ABD] font-medium">
                      {contest.statusText}
                    </p>
                  </div>
                  <Link
                    className="p-4 border rounded-md hover:bg-[#6C7993] text-white text-lg sm:text-lg bg-black mt-3 md:mt-0 text-center"
                    to="/rules"
                  >
                    Register now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Upcoming Contests</h2>
          {mockContests.upcoming.length === 0 ? (
            <p className="text-gray-500">No upcoming contests at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockContests.upcoming.map((contest) => (
                <div
                  key={contest.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col md:flex-row justify-between items-center p-3 w-full"
                >
                  <div className="p-4">
                    <h3 className="text-xl font-semibold py-3">{contest.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {contest.dateInfo}
                    </p>
                    <p className="mt-2 text-[#4B7ABD] font-medium">
                      {contest.statusText}
                    </p>
                  </div>
                  <Link
                    className="p-4 border rounded-md hover:bg-[#6C7993] text-white text-lg bg-black mt-3 md:mt-0 text-center"
                    to="/rules"
                  >
                    Register now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Contests Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Past Contests</h2>
          {mockContests.past.length === 0 ? (
            <p className="text-gray-500">No past contests found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockContests.past.map((contest) => (
                <div
                  key={contest.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-3 w-full"
                >
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{contest.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {contest.dateInfo}
                    </p>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {contest.statusText}
                    </p>
                    <button
                      className="mt-3 px-5 py-3 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#6C7993] text-white text-xl hover:bg-black dark:hover:bg-gray-600 transition-colors"
                    >
                      View Challenge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CompetePage;
