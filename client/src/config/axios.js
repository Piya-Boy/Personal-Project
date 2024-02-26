import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8888/api",
    // baseURL: "https://devbook-back-end-api.onrender.com/api",
    withCredentials: true,
});
