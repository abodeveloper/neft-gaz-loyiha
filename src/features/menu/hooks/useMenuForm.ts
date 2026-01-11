import { toastService } from "@/lib/toastService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { get } from "lodash";
import { useForm, UseFormReturn } from "react-hook-form";
import { createMenu, updateMenu } from "../api/menu";
import { createMenuSchema, MenuDto } from "../schemas/createMenuSchema";

interface UseFormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: Partial<MenuDto>;
  t: (key: string) => string;
  handleSuccess?: () => void;
}

export const useMenuForm = ({
  mode,
  id,
  initialData,
  t,
  handleSuccess,
}: UseFormProps): {
  form: UseFormReturn<MenuDto, undefined, MenuDto>;
  onSubmit: (data: MenuDto) => Promise<void>;
  mutation: ReturnType<typeof useMutation<any, AxiosError, MenuDto>>;
} => {

  const form = useForm<MenuDto, undefined, MenuDto>({
    //@ts-ignore
    resolver: zodResolver(createMenuSchema(t)), // t uzatiladi
    defaultValues: {
      parent: get(initialData, "parent", null),
      title_uz: get(initialData, "title_uz", ""),
      title_ru: get(initialData, "title_ru", ""),
      title_en: get(initialData, "title_en", ""),
      has_page: get(initialData, "has_page", true),
      page_type: get(initialData, "page_type", ""),
      page_slug: get(initialData, "page_slug", ""),
      position: get(initialData, "position"),
      status: get(initialData, "status", true),
    },
  });

  const mutation = useMutation<unknown, AxiosError, MenuDto>({
    mutationFn: (data: MenuDto) =>
      mode === "create" ? createMenu(data) : updateMenu(id!, data),
    onSuccess: () => {
      toastService.success(t("Saved successfully"));
      if (handleSuccess) handleSuccess();
    },
    onError: (error: AxiosError) => {
      const message = (error.response?.data as any)?.detail || error.message;
      toastService.error(message || t("An error occurred"));
    },
  });

  console.log(form.formState.errors);

  const onSubmit = async (data: MenuDto) => {
    await mutation.mutateAsync(data);
  };

  return { form, onSubmit, mutation };
};
