import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:8081/api",
   baseURL: "https://backend-task-2xag.onrender.com",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
