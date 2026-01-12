import { toastService } from "@/lib/toastService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { get, omit } from "lodash";
import { useForm, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createPartner, updatePartner } from "../api/partners";
import {
  createPartnerSchema,
  PartnerDto
} from "../schemas/createPartnerSchema";

interface UseFormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: Partial<PartnerDto>;
  t: (key: string) => string;
}

export const usePartnerForm = ({
  mode,
  id,
  initialData,
  t,
}: UseFormProps): {
  form: UseFormReturn<PartnerDto, undefined, PartnerDto>;
  onSubmit: (data: PartnerDto) => Promise<void>;
  mutation: ReturnType<typeof useMutation<any, AxiosError, PartnerDto>>;
} => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const form = useForm<PartnerDto, undefined, PartnerDto>({
    //@ts-ignore
    resolver: zodResolver(createPartnerSchema(t)), // t uzatiladi
    defaultValues: {
      title_uz: get(initialData, "title_uz", ""),
      title_ru: get(initialData, "title_ru", ""),
      title_en: get(initialData, "title_en", ""),
      link: get(initialData, "link", ""),
      position: get(initialData, "position"),
      status: get(initialData, "status", true),
      image: get(initialData, "image", null),
    },
  });

  const mutation = useMutation<unknown, AxiosError, PartnerDto>({
    mutationFn: (data: PartnerDto) =>
      mode === "create" ? createPartner(data) : updatePartner(id!, data),
    onSuccess: () => {
      toastService.success(t("Saved successfully"));
      navigate("/dashboard/partners");
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
    onError: (error: AxiosError) => {
      const message = (error.response?.data as any)?.detail || error.message;
      toastService.error(message || t("An error occurred"));
    },
  });

  const onSubmit = async (data: PartnerDto) => {
    let payload: any = { ...data };

    if (mode === "update" && initialData) {
      const initialImage = get(initialData, "image");

      // Agar formadagi rasm initialData dagi rasm bilan bir xil bo'lsa (ya'ni o'zgarmagan bo'lsa)
      // Odatda string (URL) bo'lib qolgan bo'ladi
      if (data.image === initialImage) {
        // image poliyasini payload dan olib tashlaymiz
        payload = omit(payload, ["image"]);
      }
    }

    await mutation.mutateAsync(payload);
  };

  return { form, onSubmit, mutation };
};
