import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import { RiPagesLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import {
  Atom,
  Ban,
  Building2,
  CheckCircle2,
  FlaskConical,
  GalleryHorizontal,
  GraduationCap,
  Layers,
  Megaphone,
  Newspaper
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { getDashboardData } from "./api/dashboard";

// Ikonkalar xaritasi
const getIconByName = (name: string) => {
  const icons: Record<string, React.ElementType> = {
    Pages: RiPagesLine,
    Departments: Building2,
    Laboratories: FlaskConical,
    "Scientific Directions": Atom,
    "Postgraduate Education": GraduationCap,
    Carousels: GalleryHorizontal,
    News: Newspaper,
    Announcements: Megaphone,
  };
  return icons[name] || Layers;
};

export default function DashboardPage() {
  const { t } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboardData(),
  });

  if (isError)
    return (
      <ErrorMessage
        title={t("Failed to load page")}
        message={t("An error occurred. Please try again later.")}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xl font-semibold tracking-tight">
          {t("Dashboard")}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? // Loading Skeleton
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-[60px] mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))
          : // Real Data
            data?.dashboard?.map((item: any, index: number) => {
              const Icon = getIconByName(item.name);

              return (
                <Card key={index} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t(item?.name)}
                    </CardTitle>
                    {/* Asosiy ikonka Shadcn primary rangida */}
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Jami soni */}
                    <div className="text-3xl font-bold">
                      {item?.total_count}
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      {t("Total items")}
                    </p>

                    <Separator className="my-2" />

                    {/* Tafsilotlar: Yashil va Qizil ranglar shu yerda */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-medium mt-3">
                      {/* Active - Yashil */}
                      <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>
                          {item?.active_count} {t("Active")}
                        </span>
                      </div>

                      {/* Inactive - Qizil (faqat mavjud bo'lsa yoki 0 bo'lsa ham ko'rinadi, xohishingizga qarab) */}
                      <div
                        className={`flex items-center gap-1.5 ${
                          item?.inactive_count > 0
                            ? "text-red-600 dark:text-red-500" // Qizil
                            : "text-muted-foreground" // Agar 0 bo'lsa, oddiy rang
                        }`}
                      >
                        <Ban className="h-3.5 w-3.5" />
                        <span>
                          {item.inactive_count} {t("Inactive")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </div>
  );
}
