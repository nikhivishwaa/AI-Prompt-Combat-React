import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

function LogoutScreen({ getAuth }) {
  const navigation = useNavigate();
  const home = useRef();

  useEffect(() => {
    secureLocalStorage.clear();
    home.current.click();
  }, []);
  return (
    <div>
      <a href="/" ref={home}></a>
    </div>
  );
}

export default LogoutScreen;
