import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getCarouselById } from "./api/carousels";
import CarouselForm from "./components/CarouselForm";

const UpdateCarouselPage = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const carouselId = parseInt(id || "0", 10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["carousels", carouselId],
    queryFn: () => getCarouselById(carouselId),
    enabled: !!carouselId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <ErrorMessage
        title={t("Failed to load page")}
        message={t("An error occurred. Please try again later.")}
      />
    );

  return <CarouselForm mode="update" id={carouselId} initialData={data} />;
};

export default UpdateCarouselPage;
