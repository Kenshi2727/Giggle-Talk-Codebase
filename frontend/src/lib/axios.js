import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "https://giggle-talk-codebase.onrender.com/api",
    withCredentials: true,// Allow cookies to be sent with requests
});
