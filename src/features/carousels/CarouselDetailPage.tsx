import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import BackButton from "@/shared/components/atoms/back-button/BackButton";
import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { formatPublishedDate, getLocalizedText } from "@/shared/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getCarouselById } from "./api/carousels";

const CarouselDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const ID = parseInt(id || "0", 10);

  const {
    data: item,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["carousels", ID],
    queryFn: () => getCarouselById(ID),
    enabled: !!ID && ID > 0,
  });

  // Loading
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Xato yoki topilmadi
  if (isError || !item) {
    return (
      <ErrorMessage
        title={t("Failed to load page")}
        message={t("An error occurred. Please try again later.")}
      />
    );
  }

  // Joriy til
  const currentLang = i18n.language;

  // Tarjima qilingan matnlar
  const title = getLocalizedText(
    {
      uz: item.title_uz,
      ru: item.title_ru,
      en: item.title_en,
    },
    currentLang,
    item.title_uz || t("No title available.")
  );

  const description = getLocalizedText(
    {
      uz: item.description_uz,
      ru: item.description_ru,
      en: item.description_en,
    },
    currentLang,
    item.description_uz || t("No description available.")
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6">
        {/* Sarlavha + Orqaga */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-foreground">
            {t("Carousel detail")}
          </h1>
          <BackButton />
        </div>

        {/* Asosiy kartochka */}
        <Card className="overflow-hidden shadow-lg">
          {/* Rasm */}
          {item.image && (
            <div className="relative h-64 md:h-96 bg-muted">
              <img
                src={item.image}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

          <CardContent className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Sarlavha */}
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {/* Sana */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatPublishedDate(item.published_date)}</span>
              </div>
              {/* Tavsif */}
              <div className="prose prose-lg max-w-none text-foreground/90">
                <p className="whitespace-pre-wrap leading-relaxed text-sm">
                  {description}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <Badge
                  variant={item.status ? "success" : "destructive"}
                  className="w-fit"
                >
                  {item.status ? t("Active") : t("Inactive")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarouselDetailPage;
