import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState(null);

  const refreshAuth = async () => {
    try {
      const res = await axios.get(
        "https://algoarena-gp5i.onrender.com/api/auth/verify",
        {
          withCredentials: true,
        }
      );
      const result = res.data;

      console.log("result", result);

      if (result.authenticated) {
        setIsLoggedIn(true);
        setData(result.user || {});

        console.log("inside", result.authenticated);
      } else {
        setIsLoggedIn(false);
        setData(null);

        console.log("outside in else");
      }
    } catch (error) {
      console.error("Error verifying user---catch:", error);
      setIsLoggedIn(false);
      setData(null);
    }
  };

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
