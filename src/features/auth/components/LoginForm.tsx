import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MyInput from "@/shared/components/atoms/form-elements/MyInput";
import { LoginDto } from "@/shared/interfaces/auth";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLoginForm } from "../hooks/useLoginForm";

export const LoginForm = () => {
  const { t } = useTranslation();

  const { form, onSubmit, loginMutation } = useLoginForm();

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-10")}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("Login to your account")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("Enter your username and password to access your account.")}
          </p>
        </div>
        <div className="space-y-8">
          <div className="space-y-6">
            <MyInput<LoginDto>
              required
              floatingError
              label={t("Username")}
              placeholder={t("Enter your username")}
              control={form.control}
              name="username"
              type="text"
            />
            <MyInput<LoginDto>
              required
              floatingError
              label={t("Password")}
              placeholder={t("Enter your password")}
              control={form.control}
              name="password"
              type="password"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            loading={loginMutation.isPending}
          >
            {t("Login")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
