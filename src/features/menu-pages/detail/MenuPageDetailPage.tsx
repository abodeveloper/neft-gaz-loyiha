import BackButton from "@/shared/components/atoms/back-button/BackButton";
import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

// ShadCN Tabs komponentlari
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { localized } from "@/i18n";
import { getMenuPageById } from "../api/menu-page";
import UpdateMenuPageContent from "./page-content/UpdateMenuPageContent";
import PageEmployees from "./page-employees/PageEmployees";
import PageFiles from "./page-files/PageFiles";
import PageImages from "./page-images/PageImages";

export default function MenuPageDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const itemId = parseInt(id || "0", 10);

  const {
    data: item,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["menu-page", itemId],
    queryFn: () => getMenuPageById(itemId),
    enabled: !!itemId && itemId > 0,
  });

  if (isLoading) return <LoadingSpinner />;

  if (isError)
    return (
      <ErrorMessage
        title={t("Failed to load page")}
        message={t("An error occurred. Please try again later.")}
      />
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-xl font-semibold">
          {t("Page")}: {localized(item, "title")}
        </div>
        <div className="flex gap-2">
          <BackButton />
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid grid-cols-4 w-[400px]">
          <TabsTrigger value="content">{t("Content")}</TabsTrigger>
          <TabsTrigger value="images">{t("Images")}</TabsTrigger>
          <TabsTrigger value="employees">{t("Employees")}</TabsTrigger>
          <TabsTrigger value="files">{t("Files")}</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <UpdateMenuPageContent />
        </TabsContent>

        <TabsContent value="images" className="mt-6">
          <PageImages />
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <PageFiles />
        </TabsContent>

        <TabsContent value="employees" className="mt-6">
          <PageEmployees />
        </TabsContent>
      </Tabs>
    </div>
  );
}
