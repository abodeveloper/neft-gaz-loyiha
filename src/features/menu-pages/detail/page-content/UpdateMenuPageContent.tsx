import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getMenuPageById } from "../../api/menu-page";
import MenuPageForm from "../../components/MenuPageForm";

const UpdateMenuPageContent = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const ID = parseInt(id || "0", 10);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["menu-page", ID],
    queryFn: () => getMenuPageById(ID),
    enabled: !!ID,
  });

  const handleSuccess = () => {
    refetch();
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <ErrorMessage
        title={t("Failed to load page")}
        message={t("An error occurred. Please try again later.")}
      />
    );

  return (
    <MenuPageForm
      id={ID}
      initialData={data}
      handleSuccess={handleSuccess}
    />
  );
};

export default UpdateMenuPageContent;
