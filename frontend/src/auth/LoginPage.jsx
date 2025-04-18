import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setData, setIsLoggedIn, refreshAuth } = useAuthContext();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://algoarena-gp5i.onrender.com/api/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usernameOrEmail, password }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setData(data);
        setIsLoggedIn(true);

        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
        });

        await refreshAuth();
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-[80vh] ${
        isDarkMode ? "bg-[#1E2939]" : "bg-[#E8F1FF]"
      } px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20`}
    >
      <div
        className={`shadow-md rounded-lg p-8 w-full max-w-md ${
          isDarkMode ? "bg-[#364153] text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2
          className={`text-3xl font-bold text-center mb-6 ${
            isDarkMode ? "text-[#EAF1FF]" : "text-gray-900"
          }`}
        >
          Sign In
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1">Username/Email</label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              className={`w-full px-3 py-2 rounded focus:outline-none ${
                isDarkMode
                  ? "bg-[#364153] border border-[#432DD7] text-white placeholder:text-[#EAF1FF]"
                  : "bg-white border border-gray-300 text-gray-900"
              }`}
              placeholder="Enter username or email"
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full px-3 py-2 rounded focus:outline-none ${
                isDarkMode
                  ? "bg-[#364153] border border-[#432DD7] text-white placeholder:text-[#EAF1FF]"
                  : "bg-white border border-gray-300 text-gray-900"
              }`}
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className={`w-full mt-4 py-2 font-bold rounded text-white ${
              isDarkMode
                ? "bg-[#432DD7] hover:bg-[#364153]"
                : "bg-[#432DD7] hover:bg-[#312C85]"
            }`}
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className={` ${isDarkMode ? "text-[#EAF1FF]" : "text-gray-600"}`}>
            Don't have an account?{" "}
            <a
              href="/signup"
              className="hover:underline"
              style={{ color: isDarkMode ? "#432DD7" : "#4B7ABD" }}
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
