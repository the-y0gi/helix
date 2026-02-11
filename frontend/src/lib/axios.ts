import axios from "axios";
import { API_BASE_URL } from "@/config/env";

export const axiosApi = axios.create({
  baseURL: `${API_BASE_URL}/api/v1` || "http://localhost:5000/api/v1",
  withCredentials: true,
});
