import { toastService } from "@/lib/toastService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { get } from "lodash";
import { useForm, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createEducation, updateEducation } from "../api/education";
import { createEducationSchema, EducationDto } from "../schemas/createEducationSchema";

interface UseFormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: Partial<EducationDto>;
  t: (key: string) => string;
}

export const useEducationForm = ({
  mode,
  id,
  initialData,
  t,
}: UseFormProps): {
    form: UseFormReturn<EducationDto, undefined, EducationDto>;
    onSubmit: (data: EducationDto) => Promise<void>;
    mutation: ReturnType<typeof useMutation<any, AxiosError, EducationDto>>;
} => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const form = useForm<EducationDto, undefined, EducationDto>({
    //@ts-ignore
    resolver: zodResolver(createEducationSchema(t)), // t uzatiladi
    defaultValues: {
      title_uz: get(initialData, "title_uz", ""),
      title_ru: get(initialData, "title_ru", ""),
      title_en: get(initialData, "title_en", ""),
      sub_title_uz: get(initialData, "sub_title_uz", ""),
      sub_title_ru: get(initialData, "sub_title_ru", ""),
      sub_title_en: get(initialData, "sub_title_en", ""),
      direction_uz: get(initialData, "direction_uz", ""),
      direction_ru: get(initialData, "direction_ru", ""),
      direction_en: get(initialData, "direction_en", ""),
      description_uz: get(initialData, "description_uz", ""),
      description_ru: get(initialData, "description_uz", ""),
      description_en: get(initialData, "description_uz", ""),
      duration_uz: get(initialData, "duration_uz", ""),
      duration_ru: get(initialData, "duration_ru", ""),
      duration_en: get(initialData, "duration_en", ""),
      logo: get(initialData, "logo"),
      position: get(initialData, "position"),
      slug: get(initialData, "slug", ""),
      status: get(initialData, "status", true),
    },
  });

  const mutation = useMutation<unknown, AxiosError, EducationDto>({
    mutationFn: (data: EducationDto) =>
      mode === "create" ? createEducation(data) : updateEducation(id!, data),
    onSuccess: () => {
      toastService.success(t("Saved successfully"));
      navigate("/dashboard/postgraduate-educations");
      queryClient.invalidateQueries({ queryKey: ["postgraduate-educations"] });
    },
    onError: (error: AxiosError) => {
      const message = (error.response?.data as any)?.detail || error.message;
      toastService.error(message || t("An error occurred"));
    },
  });

  const onSubmit = async (data: EducationDto) => {
    await mutation.mutateAsync(data);
  };

  return { form, onSubmit, mutation };
};
