import axios from "axios";

// Create a configured instance of Axios
export const apiClient = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5043",
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token'); // Or get token from your auth state
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

apiClient.interceptors.response.use(
  (response) => response.data, // Directly return data, stripping Axios wrapper metadata
  (error) => {
    if (error.response?.status === 401) {
      // Handle logout or redirect to login page here
      console.error("Unauthorized! Redirecting...");
    }
    return Promise.reject(error);
  },
);
