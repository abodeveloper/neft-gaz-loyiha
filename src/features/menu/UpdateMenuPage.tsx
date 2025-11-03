import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getMenuById } from "./api/menu";
import MenuForm from "./components/MenuForm";

const UpdateMenuPage = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const ID = parseInt(id || "0", 10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["menus", ID],
    queryFn: () => getMenuById(ID),
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

  return <MenuForm mode="update" id={ID} initialData={data} />;
};

export default UpdateMenuPage;
