import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getNewsById } from "./api/news";
import NewsForm from "./components/NewForm";

const UpdateNewsPage = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const newsId = parseInt(id || "0", 10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["news", newsId],
    queryFn: () => getNewsById(newsId),
    enabled: !!newsId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <ErrorMessage
        title={t("Failed to load page")}
        message={t("An error occurred. Please try again later.")}
      />
    );

  return <NewsForm mode="update" id={newsId} initialData={data} />;
};

export default UpdateNewsPage;
