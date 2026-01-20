import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

function handelRequestSuccess(config) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
}

function handelRequestError(error) {
  return Promise.reject(error);
}

api.interceptors.request.use(handelRequestSuccess, handelRequestError);

// RESPONSE INTERCEPTOR - Handle token expiration
function handelResponseSuccess(response) {
  return response;
}

async function handleResponseError(error) {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const response = await api.post("/auth/refresh");
      const newToken = response.data.accessToken;
      localStorage.setItem("token", newToken);
      originalRequest.headers.Authorization = "Bearer " + newToken;
      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
}
api.interceptors.response.use(handelResponseSuccess, handleResponseError);
export default api;
