import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState(null);

  // Function to fetch and update the user details using axios
  const refreshAuth = async () => {
    try {
      const res = await axios.get(
        "https://algoarena-gp5i.onrender.com/api/auth/verify",
        {
          withCredentials: true,
        }
      );
      const result = res.data;
      if (result.authenticated) {
        setIsLoggedIn(true);
        setData(result.user || {});
      } else {
        setIsLoggedIn(false);
        setData(null);
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      setIsLoggedIn(false);
      setData(null);
    }
  };

  // Run the refresh when the component mounts
  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, data, setData, refreshAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
