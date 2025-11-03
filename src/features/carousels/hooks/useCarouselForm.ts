import { toastService } from "@/lib/toastService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { get } from "lodash";
import { useForm, UseFormReturn } from "react-hook-form";
import { createCarousel, updateCarousel } from "../api/carousels";
import {
  createCarouselSchema,
  CarouselDto,
} from "../schemas/createCarouselSchema";
import { useNavigate } from "react-router-dom";

interface UseFormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: Partial<CarouselDto>;
  t: (key: string) => string;
}

export const useCarouselForm = ({
  mode,
  id,
  initialData,
  t,
}: UseFormProps): {
  form: UseFormReturn<CarouselDto, undefined, CarouselDto>;
  onSubmit: (data: CarouselDto) => Promise<void>;
  mutation: ReturnType<typeof useMutation<any, AxiosError, CarouselDto>>;
} => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const form = useForm<CarouselDto, undefined, CarouselDto>({
    //@ts-ignore
    resolver: zodResolver(createCarouselSchema(t)), // t uzatiladi
    defaultValues: {
      title_uz: get(initialData, "title_uz", ""),
      title_ru: get(initialData, "title_ru", ""),
      title_en: get(initialData, "title_en", ""),
      description_uz: get(initialData, "description_uz", ""),
      description_ru: get(initialData, "description_ru", ""),
      description_en: get(initialData, "description_en", ""),
      link: get(initialData, "link", ""),
      position: get(initialData, "position"),
      status: get(initialData, "status", true),
      image: get(initialData, "image", null),
    },
  });

  const mutation = useMutation<unknown, AxiosError, CarouselDto>({
    mutationFn: (data: CarouselDto) =>
      mode === "create" ? createCarousel(data) : updateCarousel(id!, data),
    onSuccess: () => {
      toastService.success(t("Saved successfully"));
      navigate("/dashboard/carousels");
      queryClient.invalidateQueries({ queryKey: ["carousels"] });
    },
    onError: (error: AxiosError) => {
      const message = (error.response?.data as any)?.detail || error.message;
      toastService.error(message || t("An error occurred"));
    },
  });

  const onSubmit = async (data: CarouselDto) => {
    await mutation.mutateAsync(data);
  };

  return { form, onSubmit, mutation };
};
