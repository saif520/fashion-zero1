import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://fashion-zero-server.onrender.com/api/v1" ,
  withCredentials: true,
});

export default instance;
