import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext"; 
import { Moon, Sun, ChevronDown } from "lucide-react"; 
import MyUserMenu from "./MyUserMenu";


const Navbar = () => {
  const { isLoggedIn } = useAuthContext();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div
      className={`
        sticky top-0 z-50 shadow-md
        ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-800'}
        flex items-center justify-between
        py-7 px-6 sm:px-10 lg:px-16
      `}
    >
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <span className="text-indigo-600 text-3xl">⟨⟩</span>
          <span>AlgoArena</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/practice" label="Practice" isDarkMode={isDarkMode} />
          <NavLink to="/compete" label="Compete" isDarkMode={isDarkMode} />
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full ${
            isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
          } transition-colors`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} className="text-indigo-600" />
          )}
        </button>

        {isLoggedIn ? (
          <MyUserMenu />
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className={`
                py-2 px-4 rounded-lg font-medium hidden sm:block
                ${isDarkMode 
                  ? 'text-white hover:bg-gray-800' 
                  : 'text-indigo-600 hover:bg-indigo-50'
                }
                transition-colors
              `}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={`
                py-2 px-4 rounded-lg font-medium
                ${isDarkMode 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }
                transition-colors shadow hover:shadow-md
              `}
            >
              Sign Up
            </Link>
          </div>
        )}
        

        <button className="md:hidden p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

const NavLink = ({ to, label, isDarkMode }) => (
  <Link
    to={to}
    className={`
      py-2 px-3 rounded-lg font-medium text-lg
      ${isDarkMode 
        ? 'hover:bg-gray-800 transition-colors' 
        : 'hover:bg-indigo-50 transition-colors'
      }
    `}
  >
    {label}
  </Link>
);

export default Navbar;