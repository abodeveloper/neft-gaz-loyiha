import { toastService } from "@/lib/toastService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { get } from "lodash";
import { useForm, UseFormReturn } from "react-hook-form";
import { updateMenuPage } from "../api/menu-page";
import {
  MenuPageDto,
  updateMenuPageSchema,
} from "../schemas/updateMenuPageSchema";

interface UseFormProps {
  id?: number;
  initialData?: Partial<MenuPageDto>;
  t: (key: string) => string;
  handleSuccess?: () => void;
}

export const useMenuPageForm = ({
  id,
  initialData,
  t,
  handleSuccess,
}: UseFormProps): {
  form: UseFormReturn<MenuPageDto, undefined, MenuPageDto>;
  onSubmit: (data: MenuPageDto) => Promise<void>;
  mutation: ReturnType<typeof useMutation<any, AxiosError, MenuPageDto>>;
} => {
  const form = useForm<MenuPageDto, undefined, MenuPageDto>({
    //@ts-ignore
    resolver: zodResolver(updateMenuPageSchema(t)), // t uzatiladi
    defaultValues: {
      description_uz: get(initialData, "description_uz", ""),
      description_ru: get(initialData, "description_ru", ""),
      description_en: get(initialData, "description_en", ""),
    },
  });

  const mutation = useMutation<unknown, AxiosError, MenuPageDto>({
    mutationFn: (data: MenuPageDto) => updateMenuPage(id!, data),
    onSuccess: () => {
      toastService.success(t("Saved successfully"));
      if (handleSuccess) handleSuccess();
    },
    onError: (error: AxiosError) => {
      const message = (error.response?.data as any)?.detail || error.message;
      toastService.error(message || t("An error occurred"));
    },
  });

  const onSubmit = async (data: MenuPageDto) => {
    await mutation.mutateAsync(data);
  };

  return { form, onSubmit, mutation };
};
