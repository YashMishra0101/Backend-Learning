import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
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
export default api;
