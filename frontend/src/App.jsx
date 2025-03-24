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
const App = () => {
  const location = useLocation(); //for getting current route
  return (
    <div className="">
      {location.pathname !== "/code" && <Navbar />}
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
        <Route path="/code" element={<Code />} />
      </Routes>
    </div>
  );
};

export default App;

//buttons-#4079DA
// bg of homepage-#E8F1FF
