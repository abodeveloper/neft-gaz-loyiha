import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getEducationById } from "./api/education";
import EducationForm from "./components/EducationForm";

const UpdatePostgraduateEducationPage = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const itemId = parseInt(id || "0", 10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["postgraduate-eduaction", itemId],
    queryFn: () => getEducationById(itemId),
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

  return <EducationForm mode="update" id={itemId} initialData={data} />;
};

export default UpdatePostgraduateEducationPage;
