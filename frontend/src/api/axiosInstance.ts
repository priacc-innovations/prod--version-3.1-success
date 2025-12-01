import axios, { InternalAxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Interceptor FIX for axios v1.6+ and TypeScript
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
