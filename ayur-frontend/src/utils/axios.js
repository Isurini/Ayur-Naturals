import axios from "axios";
import { getToken } from "./auth";

// 🔗 Point this to your backend (adjust if hosted)
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// ✅ Auto-attach token
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
