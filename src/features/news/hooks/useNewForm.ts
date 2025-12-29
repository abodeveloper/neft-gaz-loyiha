import { toastService } from "@/lib/toastService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { get } from "lodash";
import { useForm, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createNew, updateNew } from "../api/news";
import { createNewSchema, NewDto } from "../schemas/createNewSchema";
import { NewsType } from "../types";

interface UseNewFormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: Partial<NewDto>;
  t: (key: string) => string;
}

export const useNewForm = ({
  mode,
  id,
  initialData,
  t,
}: UseNewFormProps): {
  form: UseFormReturn<NewDto, undefined, NewDto>;
  onSubmit: (data: NewDto) => Promise<void>;
  mutation: ReturnType<typeof useMutation<any, AxiosError, NewDto>>;
} => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const form = useForm<NewDto, undefined, NewDto>({
    //@ts-ignore
    resolver: zodResolver(createNewSchema(t)), // t uzatiladi
    defaultValues: {
      title_uz: get(initialData, "title_uz", ""),
      title_ru: get(initialData, "title_ru", ""),
      title_en: get(initialData, "title_en", ""),
      description_uz: get(initialData, "description_uz", ""),
      description_ru: get(initialData, "description_ru", ""),
      description_en: get(initialData, "description_en", ""),
      type: get(initialData, "type", NewsType.NEWS),
      status: get(initialData, "status", true),
      images: get(initialData, "images", []),
      pages: get(initialData, "pages", []),
    },
  });

  const mutation = useMutation<unknown, AxiosError, NewDto>({
    mutationFn: (data: NewDto) =>
      mode === "create" ? createNew(data) : updateNew(id!, data),
    onSuccess: () => {
      toastService.success(t("Saved successfully"));
      navigate("/dashboard/news-and-announcements");
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error: AxiosError) => {
      const message = (error.response?.data as any)?.detail || error.message;
      toastService.error(message || t("An error occurred"));
    },
  });

  const onSubmit = async (data: NewDto) => {
    await mutation.mutateAsync(data);
  };

  return { form, onSubmit, mutation };
};
