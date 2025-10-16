import { toastService } from "@/lib/toastService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { get } from "lodash";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createNew, updateNew } from "../api/news";
import { createNewSchema, NewDto } from "../schemas/createNewSchema";
import { NewsType } from "../types";

interface UseNewFormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: Partial<NewDto>;
}

export const useNewForm = ({ mode, id, initialData }: UseNewFormProps) => {
  const navigate = useNavigate();

  const form = useForm<NewDto>({
    resolver: zodResolver(createNewSchema),
    defaultValues: {
      title_uz: initialData?.title_uz || "",
      title_ru: initialData?.title_ru || "",
      title_en: initialData?.title_en || "",
      description_uz: initialData?.description_uz || "",
      description_ru: initialData?.description_ru || "",
      description_en: initialData?.description_en || "",
      type: initialData?.type ?? NewsType.NEWS,
      status: initialData?.status ?? true,
      image: null, // initialData.image URL bo‘lishi mumkin, shuning uchun null
    },
  });

  const mutation = useMutation({
    mutationFn: (data: NewDto) =>
      mode === "create" ? createNew(data) : updateNew(id!, data),
    onSuccess: () => {
      toastService.success(
        `Muvaffaqiyatli ${mode === "create" ? "yaratildi" : "yangilandi"}!`
      );
      navigate("/news");
    },
    onError: (error: any) => {
      console.error("API xatosi:", error.response?.data); // Debugging
      const errorMessage = get(
        error,
        "response.data.error",
        `Yangilikni ${
          mode === "create" ? "yaratish" : "yangilash"
        } muvaffaqiyatsiz bo‘ldi`
      );
      toastService.error(errorMessage);
    },
  });

  const onSubmit: SubmitHandler<NewDto> = (data) => {
    console.log("Forma ma'lumotlari:", data); // Debugging uchun
    mutation.mutate(data);
  };

  return {
    form,
    mutation,
    onSubmit,
  };
};
