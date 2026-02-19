// import axios from "axios";
// import { API_BASE_URL } from "@/config/env";

// export const axiosApi = axios.create({
//   baseURL: `${API_BASE_URL}/api/v1` || "http://localhost:5000/api/v1",
//   withCredentials: true,
// });

import axios from "axios";
import { API_BASE_URL } from "@/config/env";

export const axiosApi = axios.create({
  baseURL: API_BASE_URL
    ? `${API_BASE_URL}/api/v1`
    : "http://localhost:5000/api/v1",
  withCredentials: true,
});

axiosApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);
