import { toastService } from "@/lib/toastService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { get } from "lodash";
import { useForm, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createLaboratory, updateLaboratory } from "../api/laboratory";
import { createLaboratorySchema, LaboratoryDto } from "../schemas/createLaboratorySchema";

interface UseFormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: Partial<LaboratoryDto>;
  t: (key: string) => string;
}

export const useLaboratoryForm = ({
  mode,
  id,
  initialData,
  t,
}: UseFormProps): {
    form: UseFormReturn<LaboratoryDto, undefined, LaboratoryDto>;
    onSubmit: (data: LaboratoryDto) => Promise<void>;
  mutation: ReturnType<typeof useMutation<any, AxiosError, LaboratoryDto>>;
} => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const form = useForm<LaboratoryDto, undefined, LaboratoryDto>({
    //@ts-ignore
    resolver: zodResolver(createLaboratorySchema(t)), // t uzatiladi
    defaultValues: {
      title_uz: get(initialData, "title_uz", ""),
      title_ru: get(initialData, "title_ru", ""),
      title_en: get(initialData, "title_en", ""),
      description_uz: get(initialData, "description_uz", ""),
      description_ru: get(initialData, "description_ru", ""),
      description_en: get(initialData, "description_en", ""),
      position: get(initialData, "position"),
      slug: get(initialData, "slug", ""),
      status: get(initialData, "status", true),
      images: get(initialData, "images", []),
    },
  });

  const mutation = useMutation<unknown, AxiosError, LaboratoryDto>({
    mutationFn: (data: LaboratoryDto) =>
      mode === "create" ? createLaboratory(data) : updateLaboratory(id!, data),
    onSuccess: () => {
      toastService.success(t("Saved successfully"));
      navigate("/dashboard/laboratories");
      queryClient.invalidateQueries({ queryKey: ["laboratories"] });
    },
    onError: (error: AxiosError) => {
      const message = (error.response?.data as any)?.detail || error.message;
      toastService.error(message || t("An error occurred"));
    },
  });

  const onSubmit = async (data: LaboratoryDto) => {
    await mutation.mutateAsync(data);
  };

  return { form, onSubmit, mutation };
};
