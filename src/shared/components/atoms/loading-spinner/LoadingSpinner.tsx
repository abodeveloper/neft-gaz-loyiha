import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner = ({
  message,
  className,
}: LoadingSpinnerProps) => {

  const {t} = useTranslation();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen gap-4",
        className
      )}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="text-lg text-muted-foreground">{message || t("Loading")}</p>
    </div>
  );
};

export default LoadingSpinner;