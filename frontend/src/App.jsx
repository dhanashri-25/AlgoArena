import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Practice from "./Pages/Practice";
import Compete from "./Pages/Compete";
import Navbar from "./components/Navbar";
import Profile from "./Pages/Profile";
import ContestRulesPage from "./components/ContestRulesPage";
import Result from "./Pages/Result";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";
import Code from "./components/CodeEditor/Code";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Leaderboard from "./Pages/Leaderboard";
import { ThemeProvider, useTheme } from "./Context/ThemeContext";

const AppContent = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();

  
  const hideNavbar =
    location.pathname === "/code" || /^\/code\/[^/]+$/.test(location.pathname);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#101828]" : "bg-[#E9F0FF]"}`}>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <Practice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compete"
          element={
            <ProtectedRoute>
              <Compete />
            </ProtectedRoute>
          }
        />
        <Route path="/rules" element={<ContestRulesPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/submit" element={<Result />} />
        <Route path="/code/:id" element={<Code />} />
        <Route path="/contest/:contestId/results" element={<Result />} />
        <Route
          path="/contest/leaderboard/:contestId"
          element={<Leaderboard />}
        />
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
