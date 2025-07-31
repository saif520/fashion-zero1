import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ redirectPath = "/" }) => {
  const { setIsAuthenticated, setUser } = useContext(Context);
  const navigateTo = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(res.data.message);
      setIsAuthenticated(true);
      setUser(res.data.user);
      navigateTo(redirectPath);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(handleLogin)}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        required
        {...register("email")}
      />
      <input
        type="password"
        placeholder="Password"
        required
        {...register("password")}
      />
      <p className="forgot-password">
        <Link to="/password/forgot">Forgot your password?</Link>
      </p>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login; 
