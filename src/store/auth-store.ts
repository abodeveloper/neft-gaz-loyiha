import api from "@/lib/axios";
import { cookieService } from "@/lib/cookieService";
import { toastService } from "@/lib/toastService";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated:
        !!cookieService.getToken() || !!localStorage.getItem("accessToken"),
      accessToken:
        cookieService.getToken() || localStorage.getItem("accessToken") || null,
      refreshToken: localStorage.getItem("refreshToken") || null,
      loading: false,

      login: async (username: string, password: string) => {
        set({ loading: true });
        try {
          const response = await api.post<{ access: string; refresh: string }>(
            "/token/",
            {
              username,
              password,
            }
          );
          const { access, refresh } = response.data;

          // Tokenlarni saqlash
          cookieService.setToken(access);
          localStorage.setItem("accessToken", access);
          localStorage.setItem("refreshToken", refresh);

          set({
            isAuthenticated: true,
            accessToken: access,
            refreshToken: refresh,
            loading: false,
          });
          toastService.success("Muvaffaqiyatli kirish!");
        } catch (error: any) {
          set({ loading: false });
          console.error("Login error:", error);
          toastService.error(
            error.response?.data?.detail || "Kirishda xato yuz berdi"
          );
          throw error;
        }
      },

      logout: () => {
        cookieService.removeToken();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("auth-storage");
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          loading: false,
        });
        toastService.info("Tizimdan chiqildi");
      },

      fetchMe: async () => {
        set({ loading: true });
        try {
          set({ isAuthenticated: true, loading: false });
        } catch (error: any) {
          console.error("Failed to fetch user:", error);
          set({ loading: false });
          toastService.error("Foydalanuvchi ma'lumotlarini olishda xato");
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
