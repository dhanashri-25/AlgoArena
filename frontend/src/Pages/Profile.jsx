import React from "react";
import { useUser } from "@clerk/clerk-react";
import { FaUser } from "react-icons/fa";

const ProfilePage = () => {
  const { user } = useUser();

  // If Clerk user is loading or not signed in, handle gracefully
  if (!user) {
    return <div className="p-6">Please sign in to view your profile.</div>;
  }

  // Fallback to default avatar if Clerk doesn’t provide one
  const profileImg = user.setProfileImage || "/default-avatar.png";

  // Example local data for rank, problems solved, etc.
  const userData = {
    rank: 359044,
    easySolved: 20,
    mediumSolved: 15,
    hardSolved: 5,
    recentSubmissions: [
      { title: "Add Two Numbers", daysAgo: "1 day ago" },
      { title: "Word Break", daysAgo: "7 days ago" },
      { title: "House Robber", daysAgo: "7 days ago" },
      {
        title: "Find First and Last Position of Element in Sorted Array",
        daysAgo: "7 days ago",
      },
      { title: "Maximum Sum Circular Subarray", daysAgo: "7 days ago" },
      { title: "Course Schedule II", daysAgo: "8 days ago" },
      { title: "Course Schedule", daysAgo: "8 days ago" },
      { title: "Surrounded Regions", daysAgo: "8 days ago" },
      { title: "Minimum Absolute Difference in BST", daysAgo: "9 days ago" },
      { title: "Kth Smallest Element in a BST", daysAgo: "9 days ago" },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-wrap gap-8 mb-8">
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-5">
            <div className="flex flex-col items-center md:items-start md:flex-row">
              <div className="m-auto">
                <FaUser size={92} />
              </div>
              <div className=" mt-4 md:mt-0 text-center md:text-left">
                <h2 className="text-2xl font-bold">
                  {user.firstName || user.username}
                </h2>
                <p className="text-gray-500">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
                <p className="text-gray-700 mt-1">
                  Rank{" "}
                  <span className="font-semibold">
                    {userData.rank.toLocaleString()}
                  </span>
                </p>
                <button className="mt-4 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded transition w-full">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center ">
              <h3 className="text-xl font-semibold text-green-600">Easy</h3>
              <p className="text-2xl font-bold">{userData.easySolved}</p>
              <p className="text-sm text-gray-500">problems solved</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <h3 className="text-xl font-semibold text-yellow-600">Medium</h3>
              <p className="text-2xl font-bold">{userData.mediumSolved}</p>
              <p className="text-sm text-gray-500">problems solved</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <h3 className="text-xl font-semibold text-red-600">Hard</h3>
              <p className="text-2xl font-bold">{userData.hardSolved}</p>
              <p className="text-sm text-gray-500">problems solved</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent AC</h2>
            <a href="#!" className="text-blue-500 hover:underline">
              View all submissions &rarr;
            </a>
          </div>
          <ul className="space-y-2">
            {userData.recentSubmissions.map((submission, idx) => (
              <li
                key={idx}
                className="flex justify-between bg-gray-50 hover:bg-gray-100 transition px-4 py-2 rounded"
              >
                <span>{submission.title}</span>
                <span className="text-gray-400 text-sm">
                  {submission.daysAgo}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
