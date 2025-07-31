import React, { useContext, useState, useEffect } from "react";
import "../styles/Auth.css";
import { Context } from "../main";
import { Navigate, useSearchParams } from "react-router-dom";
import Register from "../components/Register";
import Login from "../components/Login";

const Auth = () => {
  const { isAuthenticated } = useContext(Context);
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const type = searchParams.get("type"); // 'login' or 'register'

  // Initialize isLogin from query
  const [isLogin, setIsLogin] = useState(type !== "register"); // Default to login

  // Update isLogin if URL param changes
  useEffect(() => {
    setIsLogin(type !== "register");
  }, [type]);

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-toggle">
          <button
            className={`toggle-btn ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`toggle-btn ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
        {isLogin ? (
          <Login redirectPath={redirectPath} />
        ) : (
          <Register redirectPath={redirectPath} />
        )}
      </div>
    </div>
  );
};

export default Auth;
