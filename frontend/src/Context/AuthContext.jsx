import { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState(null);


  
  useEffect(() => {
    const verifyUser=async()=>{
      try{
        const res=await fetch("http://localhost:5000/api/auth/verify",{
          method:"GET",
          credentials:"include",
        });
        const result=await res.json();
        if(result.authenticated){
          setIsLoggedIn(true);
          setData(result.user||{});
        }else{
          setIsLoggedIn(false);
          setData(null);
        }
      }catch(error){
        console.log("error verifying",error);
        setIsLoggedIn(false);
        setData(null);
      }
    }
    verifyUser();
  }, []); 



  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, data, setData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const abc = useContext(AuthContext);
  return abc;
};
