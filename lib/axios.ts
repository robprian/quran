import axios from "axios";
import { API_BASE_URL } from "./constants";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("[API Error]", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("[Network Error] No response received", error.message);
    } else {
      console.error("[Request Error]", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
