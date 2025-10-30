import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string; // agar berilsa navigatsiya qiladi
  onClick?: () => void; // custom handler
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "default" | "outline";
  className?: string;
  ariaLabel?: string;
  label?: string; // tugma matni
  iconOnly?: boolean; // true bo'lsa faqat ikon ko'rsatadi
}

export default function BackButton({
  to,
  onClick,
  size = "md",
  variant = "default",
  className = "",
  ariaLabel,
  label,
  iconOnly = false,
}: BackButtonProps) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const sizeClass = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  }[size];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick();
      return;
    }

    if (to) {
      navigate(to);
      return;
    }

    navigate(-1);
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className={`${className} inline-flex items-center gap-2 ${sizeClass}`}
      aria-label={ariaLabel || t("Go back")}
    >
      <ArrowLeft className="w-4 h-4" />
      {!iconOnly && (
        <span className="whitespace-nowrap">{label || t("Back")}</span>
      )}
    </Button>
  );
}
