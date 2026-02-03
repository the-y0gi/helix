import axios from "axios"
import { API_BASE_URL } from "@/config/env"

export const axiosApi = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/" : "/api",
  withCredentials: true,
});

