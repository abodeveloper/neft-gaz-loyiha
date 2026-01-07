import { toastService } from "@/lib/toastService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { get } from "lodash";
import { useForm, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createScientific, updateScientific } from "../api/scientific";
import { createScientificSchema, ScientificDto } from "../schemas/createScientificSchema";

interface UseFormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: Partial<ScientificDto>;
  t: (key: string) => string;
}

export const useScientificForm = ({
  mode,
  id,
  initialData,
  t,
}: UseFormProps): {
    form: UseFormReturn<ScientificDto, undefined, ScientificDto>;
  onSubmit: (data: ScientificDto) => Promise<void>;
    mutation: ReturnType<typeof useMutation<any, AxiosError, ScientificDto>>;
} => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const form = useForm<ScientificDto, undefined, ScientificDto>({
    //@ts-ignore
    resolver: zodResolver(createScientificSchema(t)), // t uzatiladi
    defaultValues: {
      title_uz: get(initialData, "title_uz", ""),
      title_ru: get(initialData, "title_ru", ""),
      title_en: get(initialData, "title_en", ""),
      sub_title_uz: get(initialData, "sub_title_uz", ""),
      sub_title_ru: get(initialData, "sub_title_ru", ""),
      sub_title_en: get(initialData, "sub_title_en", ""),
      description_uz: get(initialData, "description_uz", ""),
      description_ru: get(initialData, "description_ru", ""),
      description_en: get(initialData, "description_en", ""),
      logo: get(initialData, "logo"),
      position: get(initialData, "position"),
      slug: get(initialData, "slug", ""),
      status: get(initialData, "status", true),
    },
  });

  const mutation = useMutation<unknown, AxiosError, ScientificDto>({
    mutationFn: (data: ScientificDto) =>
      mode === "create" ? createScientific(data) : updateScientific(id!, data),
    onSuccess: () => {
      toastService.success(t("Saved successfully"));
      navigate("/dashboard/scientific-directions");
      queryClient.invalidateQueries({ queryKey: ["scientific-directions"] });
    },
    onError: (error: AxiosError) => {
      const message = (error.response?.data as any)?.detail || error.message;
      toastService.error(message || t("An error occurred"));
    },
  });

  const onSubmit = async (data: ScientificDto) => {
    await mutation.mutateAsync(data);
  };

  return { form, onSubmit, mutation };
};
