import React, { useState } from "react";
import { FaUserCircle, FaEdit, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";

const MyUserMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { data, setIsLoggedIn, setData } = useAuthContext();

  if (!data) {
    return null;
  }

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleSignOut = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        credentials: "include",
        method: "GET",
      });
      const result = await res.json();
      if (result.success) {
        setIsLoggedIn(false);
        setData(null);
        navigate("/");
      } else {
        alert(result.message || "Logout failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggleMenu}
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
      >
        <FaUser className="text-3xl" />
        <span className="font-semibold">{data.name}</span>
      </button>

      {menuOpen && (
        <div
          className="
            absolute right-0 mt-5 bg-white
            rounded-lg shadow-2xl
            py-2 z-25 w-70
          "
        >
          {/* User Info at top of menu */}
          <Link className="flex items-center gap-2 px-4 py-2 " to="/profile">
            <div className="inline-flex items-center p-3  rounded-full bg-[#C4C4C4] text-white">
              <FaUser className="text-2xl" />
            </div>
            <div>
              <div className="font-semibold">{data.name}</div>
              <div className="text-sm text-gray-500">{data.email}</div>
            </div>
          </Link>

          <div className="px-2">
            <Link
              className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-50"
              to="/profile"
            >
              <FaUserCircle className="mr-4" />
              My Profile
            </Link>

            <Link
              className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-50"
              to="/edit-profile"
            >
              <FaEdit className="mr-4" />
              Edit Profile
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
            >
              <FaSignOutAlt className="mr-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyUserMenu;
