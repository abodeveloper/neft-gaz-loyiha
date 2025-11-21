import { toastService } from "@/lib/toastService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { get } from "lodash";
import { useForm, UseFormReturn } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createPageFile, updatePageFile } from "../api/page-file";
import {
  createPageFileSchema,
  PageFileDto,
} from "../schemas/createPageFileSchema";

interface UseFormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: Partial<PageFileDto>;
  t: (key: string) => string;
}

export const usePageFileForm = ({
  mode,
  id,
  initialData,
  t,
}: UseFormProps): {
  form: UseFormReturn<PageFileDto, undefined, PageFileDto>;
  onSubmit: (data: PageFileDto) => Promise<void>;
  mutation: ReturnType<typeof useMutation<any, AxiosError, PageFileDto>>;
} => {
  const { id: pageId } = useParams();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const form = useForm<PageFileDto, undefined, PageFileDto>({
    //@ts-ignore
    resolver: zodResolver(createPageFileSchema(t)), // t uzatiladi
    defaultValues: {
      page: pageId ? Number(pageId) : null,
      title_uz: get(initialData, "title_uz", ""),
      title_ru: get(initialData, "title_ru", ""),
      title_en: get(initialData, "title_en", ""),
      position: get(initialData, "position"),
      status: get(initialData, "status", true),
      file: get(initialData, "file", null),
    },
  });

  const mutation = useMutation<unknown, AxiosError, PageFileDto>({
    mutationFn: (data: PageFileDto) =>
      mode === "create" ? createPageFile(data) : updatePageFile(id!, data),
    onSuccess: () => {
      toastService.success(t("Saved successfully"));
      navigate(`/dashboard/menu-pages/view/${pageId}`);
      queryClient.invalidateQueries({ queryKey: ["page-files"] });
    },
    onError: (error: AxiosError) => {
      const message = (error.response?.data as any)?.detail || error.message;
      toastService.error(message || t("An error occurred"));
    },
  });

  const onSubmit = async (data: PageFileDto) => {
    await mutation.mutateAsync(data);
  };

  return { form, onSubmit, mutation };
};
