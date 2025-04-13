import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-auto lg:h-[80vh] text-center lg:text-left px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-10 bg-[#E8F1FF]">
      <section className="flex flex-col w-full lg:w-1/2">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
          Start Your Coding Journey with Contestify
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl text-base sm:text-lg">
          Join DSA contests, practice past problems, and compete to sharpen your
          coding skills.
        </p>

        <div className="mt-6 text-lg sm:text-xl flex flex-col sm:flex-row justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            to="/compete"
            className="px-6 py-3 border border-gray-700 text-[#4B7ABD] font-bold transition-all duration-300 hover:bg-[#4B7ABD] hover:text-white hover:shadow-md"
          >
            Join a Contest
          </Link>

          
          <Link
            to="/practice"
            className="px-6 py-3 border border-gray-300 rounded-lg bg-black transition-all duration-300 hover:bg-white hover:text-black text-white"
          >
            Practice Problems
          </Link>
        </div>
      </section>

      <img
        src={"/homeIcon.png"}
        alt="Coding illustration"
        className="w-full sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 mt-6 lg:mt-0"
      />
    </div>
  );
};

export default HomePage;
