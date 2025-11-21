import { toastService } from "@/lib/toastService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { get } from "lodash";
import { useForm, UseFormReturn } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createPageImage, updatePageImages } from "../api/page-image";
import {
  createPageImageSchema,
  PageImageDto,
} from "../schemas/createPageImageSchema";

interface UseFormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: Partial<PageImageDto>;
  t: (key: string) => string;
}

export const usePageImageForm = ({
  mode,
  id,
  initialData,
  t,
}: UseFormProps): {
  form: UseFormReturn<PageImageDto, undefined, PageImageDto>;
  onSubmit: (data: PageImageDto) => Promise<void>;
  mutation: ReturnType<typeof useMutation<any, AxiosError, PageImageDto>>;
} => {
  const { id: pageId } = useParams();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const form = useForm<PageImageDto, undefined, PageImageDto>({
    //@ts-ignore
    resolver: zodResolver(createPageImageSchema(t)), // t uzatiladi
    defaultValues: {
      page: pageId ? Number(pageId) : null,
      image: get(initialData, "image", null),
    },
  });

  const mutation = useMutation<unknown, AxiosError, PageImageDto>({
    mutationFn: (data: PageImageDto) =>
      mode === "create" ? createPageImage(data) : updatePageImages(id!, data),
    onSuccess: () => {
      toastService.success(t("Saved successfully"));
      navigate(`/dashboard/menu-pages/view/${pageId}`);
      queryClient.invalidateQueries({ queryKey: ["page-images"] });
    },
    onError: (error: AxiosError) => {
      const message = (error.response?.data as any)?.detail || error.message;
      toastService.error(message || t("An error occurred"));
    },
  });

  const onSubmit = async (data: PageImageDto) => {
    await mutation.mutateAsync(data);
  };

  return { form, onSubmit, mutation };
};
