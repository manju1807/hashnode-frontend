import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to the headers
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log("Unauthorized, logging out...");
          break;
        case 403:
          console.log("Forbidden");
          break;
        case 404:
          console.log("Resource not found");
          break;
        case 500:
          console.log("Server error");
          break;
        default:
          console.log("An error occurred");
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
