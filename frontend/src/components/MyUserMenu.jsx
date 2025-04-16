import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaEdit, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { toast } from "react-toastify";

const MyUserMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { isDarkMode } = useTheme();

  const { data, setIsLoggedIn, setData } = useAuthContext();

  const id = data?._id;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        toast.error(result.message || "Logout failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleToggleMenu}
        className={`
          flex items-center gap-2 p-2 rounded-lg transition-colors
          ${
            isDarkMode
              ? "hover:bg-gray-800 text-white"
              : "hover:bg-indigo-50 text-gray-800"
          }
        `}
      >
        <div
          className={`
          w-8 h-8 rounded-full flex items-center justify-center
          ${isDarkMode ? "bg-indigo-600" : "bg-indigo-600"}
          text-white
        `}
        >
          {data.name ? data.name.charAt(0).toUpperCase() : <FaUser />}
        </div>
        <span className="font-medium hidden sm:block">
          {data?.name || data?.username || "User"}
        </span>
      </button>

      {menuOpen && (
        <div
          className={`
            absolute right-0 mt-2 rounded-lg shadow-xl w-70 z-50 overflow-hidden
            ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }
          `}
        >
          <Link
            className={`
              flex items-center gap-3 p-4 
              ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}
              transition-colors
            `}
            to={`/profile/${id}`}
          >
            <div
              className={`
              inline-flex items-center justify-center p-2 rounded-4xl px-4
              ${isDarkMode ? "bg-indigo-600" : "bg-indigo-600"} 
              text-white
            `}
            >
              {data.name ? (
                data.name.charAt(0).toUpperCase()
              ) : (
                <FaUser className="text-lg" />
              )}
            </div>
            <div>
              <div
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {data.name || data.username}
              </div>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {data.email}
              </div>
            </div>
          </Link>

          <div
            className={`border-t ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <Link
              className={`
                flex items-center w-full text-left px-4 py-3
                ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-gray-200"
                    : "hover:bg-gray-50 text-gray-700"
                }
                transition-colors
              `}
              to={`/profile/${id}`}
            >
              <FaUserCircle className="mr-3 text-lg" />
              My Profile
            </Link>

            <Link
              className={`
                flex items-center w-full text-left px-4 py-3
                ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-gray-200"
                    : "hover:bg-gray-50 text-gray-700"
                }
                transition-colors
              `}
              to={`/profile/${id}`}
            >
              <FaEdit className="mr-3 text-lg" />
              Edit Profile
            </Link>

            <button
              onClick={handleSignOut}
              className={`
                flex items-center w-full text-left px-4 py-3
                ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-red-400"
                    : "hover:bg-gray-50 text-red-600"
                }
                transition-colors
              `}
            >
              <FaSignOutAlt className="mr-3 text-lg" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyUserMenu;
