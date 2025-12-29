import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getLaboratoryById } from "./api/laboratory";
import NewsForm from "./components/LaboratoryForm";

const UpdateLaboratoryPage = () => {
  
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const itemId = parseInt(id || "0", 10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["laboratories", itemId],
    queryFn: () => getLaboratoryById(itemId),
    enabled: !!itemId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <ErrorMessage
        title={t("Failed to load page")}
        message={t("An error occurred. Please try again later.")}
      />
    );

  return <NewsForm mode="update" id={itemId} initialData={data} />;
};

export default UpdateLaboratoryPage;
