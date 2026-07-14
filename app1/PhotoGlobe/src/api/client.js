import axios from "axios";

// Create a configured instance of Axios
const apiClient = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: import.meta.env.VITE_BASE_URL_LOCAL,
  timeout: 3000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// This interceptor grabs the base URL at the exact moment a request is fired
export const setupAxiosInterceptors = (apiBaseUrl) => {
  console.log("Setting Axios Base URL to:", apiBaseUrl);
  if (apiBaseUrl) {
    apiClient.defaults.baseURL = apiBaseUrl;

    apiClient.interceptors.request.use(
      (config) => {
        console.log(`Axios sending request to: ${config.baseURL}${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }
};

// Response Interceptor to handle the fallback mechanism
// apiClient.interceptors.response.use(
//   // Pass successful responses straight through
//   (response) => response,

//   // Handle failed requests
//   async (error) => {
//     const originalRequest = error.config;

//     // Detect network connection errors, timeouts, or refused connections
//     const isNetworkError = !error.response || error.code === "ECONNABORTED";

//     // Fallback logic: Only retry if it's a network error and we haven't already retried this request
//     if (isNetworkError && !originalRequest._retry) {
//       originalRequest._retry = true; // Mark request so we don't loop infinitely

//       console.warn(
//         `Local API failed (${error.message}). Retrying with Public IP...`,
//       );

//       // Switch the configuration over to the Public IP URL
//       originalRequest.baseURL = VITE_API_BASE_URL_PUBLIC;

//       // Update the fully resolved URL if Axios has already concatenated it
//       if (originalRequest.url.startsWith(VITE_API_BASE_URL_LOCAL)) {
//         originalRequest.url = originalRequest.url.replace(
//           VITE_API_BASE_URL_LOCAL,
//           VITE_API_BASE_URL_PUBLIC,
//         );
//       }

//       // Re-execute the exact same request (includes original headers, body, methods)
//       return apiClient(originalRequest);
//     }

//     // If it's a normal API error (like a 400 or 500 error) or the public fallback also fails, reject it
//     return Promise.reject(error);
//   },
// );
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

export default apiClient;
