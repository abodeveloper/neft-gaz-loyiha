import { toastService } from "@/lib/toastService";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LoginFormValues, loginSchema } from "../schemas/login-schema";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const useLoginForm = () => {

  const {t} = useTranslation();

  const navigate = useNavigate();
  const { login: loginToStore, loading } = useAuthStore();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema(t)),
    defaultValues: {
      username: "admin",
      password: "12345",
    },
  });

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: LoginFormValues) => loginToStore(username, password),
    onSuccess: () => {
      // Success toast store'da ko'rsatiladi
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toastService.error(error.message || "Kirishda xato yuz berdi");
    },
  });

  useEffect(() => {
    if (loginMutation.isSuccess && !loading) {
      navigate("/dashboard", { replace: true });
    }
  }, [loginMutation.isSuccess, loading, navigate]);

  const onSubmit = (data: LoginFormValues) => {
    form.reset();
    loginMutation.mutate(data);
  };

  return {
    form,
    loginMutation,
    onSubmit,
  };
};