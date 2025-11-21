import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getPageFileById } from "./api/page-file";
import PageFileForm from "./components/PageFileForm";

const UpdatePageFilePage = () => {
  const { t } = useTranslation();

  const { itemId } = useParams<{ id: string; itemId: string }>();
  const ID = parseInt(itemId || "0", 10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["page-files", ID],
    queryFn: () => getPageFileById(ID),
    enabled: !!ID,
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <ErrorMessage
        title={t("Failed to load page")}
        message={t("An error occurred. Please try again later.")}
      />
    );

  return <PageFileForm mode="update" id={ID} initialData={data} />;
};

export default UpdatePageFilePage;
