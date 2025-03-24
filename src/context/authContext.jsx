import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  const initiateAuthConfirmation = async () => {
    const authStatus = async () => {
      try {
        const auth = JSON.parse(secureLocalStorage.getItem("auth"));
        const lastLogin = parseInt(secureLocalStorage.getItem("lastLogin"));
        console.log({ lastLogin });
        console.log({ auth });
        if (auth && auth?.access && !isNaN(lastLogin)) {
          const isExpired =
            new Date().getTime() - lastLogin > 1000 * 3600 * 24 * 2;
          console.log(isExpired);
          if (isExpired) {
            secureLocalStorage.clear();
            setUser(null);
            setToken("");
            return false;
          }
          setUser(auth.user);
          setToken(auth.access);
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    };
    const authStatusResult = await authStatus();
    if (authStatusResult) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    initiateAuthConfirmation();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        token,
        initiateAuthConfirmation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = () => useContext(AuthContext);
