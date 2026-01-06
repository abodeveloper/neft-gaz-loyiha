import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getCompanyData } from "./api/company";
import CompanyForm from "./components/CompanyForm";

const UpdateCompanyPage = () => {

  const { t } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["company"],
    queryFn: () => getCompanyData(),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <ErrorMessage
        title={t("Failed to load page")}
        message={t("An error occurred. Please try again later.")}
      />
    );

  return <CompanyForm  initialData={data} />;
};

export default UpdateCompanyPage;
