import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

function LogoutScreen({ getAuth }) {
  const navigation = useNavigate();

  useEffect(() => {
    secureLocalStorage.clear();
    getAuth();
    alert('✅ You Logged out successfully');
    navigation("/login", { replace: true });
  }, []);
  return <div></div>;
}

export default LogoutScreen;
