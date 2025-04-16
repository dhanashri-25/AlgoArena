import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext"; // You'll need to create this

const HomePage = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-16 py-16 lg:py-20">
        <section className="flex flex-col w-full lg:w-1/2 mb-12 lg:mb-0">
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-800"
            } leading-tight`}
          >
            Elevate Your <span className="text-indigo-600">Coding Skills</span>{" "}
            with AlgoArena
          </h1>
          <p
            className={`mt-6 text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } max-w-2xl`}
          >
            Master data structures and algorithms through competitive coding,
            real-time challenges, and focused practice.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/compete"
              className={`px-8 py-4 rounded-lg font-medium text-center ${
                isDarkMode
                  ? "bg-indigo-700 text-white hover:bg-indigo-700"
                  : "bg-indigo-700 text-white hover:bg-black"
              } transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              Join a Contest
            </Link>

            <Link
              to="/practice"
              className={`px-8 py-4 rounded-lg font-medium text-center ${
                isDarkMode
                  ? "bg-gray-800 text-white border border-gray-600 hover:bg-gray-700"
                  : "bg-white text-indigo-700 border border-indigo-700 hover:bg-indigo-50"
              } transition-all duration-300 shadow hover:shadow-md`}
            >
              Practice Problems
            </Link>
          </div>
        </section>

        <div className="w-full lg:w-5/12 flex justify-center">
          <img
            src={isDarkMode ? "/homeIcon.png" : "/homeIcon.png"}
            alt="Competitive coding illustration"
            className="w-full max-w-lg object-contain"
          />
        </div>
      </div>

      <div className={`py-16 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="container mx-auto px-6 sm:px-10">
          <h2
            className={`text-3xl font-bold mb-12 text-center ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Why Choose AlgoArena?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Fair Competitions",
                description:
                  "Anti-cheat measures including tab monitoring and camera validation ensure a level playing field for all participants.",
                icon: "🛡️",
              },
              {
                title: "Focused Learning",
                description:
                  "Practice past contest problems, track your progress, and identify areas for improvement.",
                icon: "📈",
              },
              {
                title: "Global Leaderboard",
                description:
                  "Compare your performance with coders worldwide and see where you stand in the rankings.",
                icon: "🏆",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-blue-50 hover:bg-blue-100"
                } transition-all duration-300 flex flex-col items-center text-center`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {feature.title}
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`py-16 ${isDarkMode ? "bg-gray-900" : "bg-indigo-50"}`}>
        <div className="container mx-auto px-6 sm:px-10">
          <h2
            className={`text-3xl font-bold mb-12 text-center ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            How AlgoArena Works
          </h2>

          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {[
              {
                number: "01",
                title: "Register for contests",
                description:
                  "Sign up for upcoming competitions and put your skills to the test.",
              },
              {
                number: "02",
                title: "Solve challenges",
                description:
                  "Complete algorithmically challenging problems within time constraints.",
              },
              {
                number: "03",
                title: "Practice regularly",
                description:
                  "Access previous contest problems and improve your problem-solving skills.",
              },
              {
                number: "04",
                title: "Track progress",
                description:
                  "Review your performance and see your improvement over time.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center mb-8 md:mb-0"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    isDarkMode
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {step.number}
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } max-w-xs`}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`py-16 ${
          isDarkMode ? "bg-indigo-900" : "bg-indigo-900"
        } text-white`}
      >
        <div className="container mx-auto px-6 sm:px-10 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to challenge yourself?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are improving their coding skills
            through competitive programming.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 rounded-lg font-medium bg-white text-indigo-900 hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Create Account
            </Link>
            <Link
              to="/compete"
              className="px-8 py-4 rounded-lg font-medium bg-transparent border border-white text-white hover:bg-white/10 transition-all duration-300"
            >
              View Contests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
