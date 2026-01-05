import axios from "axios";
import { config } from "./config";
import { useAuthStore } from "../store/authstore";

const apiClient = axios.create({
    baseURL: config.baseURL,
    headers: config.defaultHeaders,
});

apiClient.interceptors.request.use((requestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired - clear store and redirect
            useAuthStore.setState({ token: null, user: null });
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);

export default apiClient;
