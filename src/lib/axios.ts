import axios from "axios";
import { cookieService } from "@/lib/cookieService";
import { toastService } from "@/lib/toastService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor - har so'rovga accessToken qo'shish
api.interceptors.request.use(
  (config) => {
    const accessToken = cookieService.getToken() || localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - 401 bo'lsa refresh token bilan yangilash
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          // Refresh token yo'q bo'lsa, logout
          cookieService.removeToken();
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("auth-storage");
          window.location.href = "/login";
          toastService.error("Sessiya tugadi, iltimos qayta kiring");
          return Promise.reject(error);
        }

        // Refresh token bilan yangi access token olish
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });
        const { access } = response.data;

        // Yangi access tokenni saqlash
        cookieService.setToken(access);
        localStorage.setItem("accessToken", access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh muvaffaqiyatsiz bo'lsa, logout
        cookieService.removeToken();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("auth-storage");
        window.location.href = "/login";
        toastService.error("Tokenni yangilashda xato");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;