import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const { setData, setIsLoggedIn } = useAuthContext();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const signupData = { name, username, email, password, confirmpassword };
    try {
      const res = await fetch(
        "https://algoarena-gp5i.onrender.com/api/auth/signup",
        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signupData),
        }
      );
      const result = await res.json();
      if (res.ok && result.success) {
        setData(result);
        setIsLoggedIn(true);
        toast.success("Signup successful!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
        });
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error("Signup failed: " + (result.message || "Unknown error"), {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);
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
          Sign Up
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`w-full px-3 py-2 rounded focus:outline-none ${
                isDarkMode
                  ? "bg-[#364153] border border-[#432DD7] text-white placeholder:text-[#EAF1FF]"
                  : "bg-white border border-gray-300 text-gray-900"
              }`}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block mb-1">Username</label>
            <input
              autoComplete="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`w-full px-3 py-2 rounded focus:outline-none ${
                isDarkMode
                  ? "bg-[#364153] border border-[#432DD7] text-white placeholder:text-[#EAF1FF]"
                  : "bg-white border border-gray-300 text-gray-900"
              }`}
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-3 py-2 rounded focus:outline-none ${
                isDarkMode
                  ? "bg-[#364153] border border-[#432DD7] text-white placeholder:text-[#EAF1FF]"
                  : "bg-white border border-gray-300 text-gray-900"
              }`}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
              autoComplete="new-password"
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
          <div>
            <label className="block mb-1">Confirm Password</label>
            <input
              autoComplete="new-password"
              type="password"
              value={confirmpassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
              required
              className={`w-full px-3 py-2 rounded focus:outline-none ${
                isDarkMode
                  ? "bg-[#364153] border border-[#432DD7] text-white placeholder:text-[#EAF1FF]"
                  : "bg-white border border-gray-300 text-gray-900"
              }`}
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            className={`w-full mt-4 py-2 font-bold rounded text-white ${
              isDarkMode
                ? "bg-[#432DD7] hover:bg-[#312C85]"
                : "bg-[#432DD7] hover:bg-[#312C85]"
            }`}
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className={` ${isDarkMode ? "text-[#EAF1FF]" : "text-gray-600"}`}>
            Already have an account?{" "}
            <a
              href="/login"
              className="hover:underline"
              style={{ color: isDarkMode ? "#432DD7" : "#4B7ABD" }}
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
