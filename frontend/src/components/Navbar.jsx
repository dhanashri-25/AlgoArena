import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";
import MyUserMenu from "./MyUserMenu";
const Navbar = () => {
  const { isLoggedIn } = useAuthContext();
  return (
    <div
      className="
        shadow-lg shadow-gray-300 relative z-10 text-gray-700
        flex flex-col md:flex-row justify-between items-center
        py-4 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12
      "
    >
      <div className="flex gap-5 md:gap-10 items-center mb-4 md:mb-0">
        <div className="text-2xl py-2 font-bold">
          <Link to="/">SolveSphere</Link>
        </div>
        <div className="flex gap-3 text-lg">
          <Link
            to="/practice"
            className="hover:bg-[#eaeef5] rounded-sm transition-all duration-300 p-2"
          >
            Practice
          </Link>
          <Link
            to="/compete"
            className="hover:bg-[#eaeef5] rounded-sm transition-all duration-300 p-2"
          >
            Compete
          </Link>
        </div>
      </div>
      {isLoggedIn ? (
        <MyUserMenu />
      ) : (
        <div className="flex gap-3 text-lg items-center">
          <Link
            to="/login"
            className="
            py-2 px-4 hover:bg-[#E8F1FF] hover:shadow-md
            text-[#4B7ABD] font-semibold
          "
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="
            py-2 px-4 border border-gray-700 text-[#4B7ABD] font-semibold
            hover:bg-[#4B7ABD] hover:text-white hover:shadow-md
          "
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
