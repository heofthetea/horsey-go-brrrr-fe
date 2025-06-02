/**
 * Provides an axios instance to handle API calls
 */
import axios from "axios";
import keycloak from "@/plugins/keycloak";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    await keycloak.updateToken(30).catch(() => {
        console.warn("[Keycloak] Token update failed");
        keycloak.login();
    });
    if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
});

export default api;
