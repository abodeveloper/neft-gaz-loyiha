import { toastService } from "@/lib/toastService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { get } from "lodash";
import { useForm, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createDepartment, updateDepartment } from "../api/department";
import { createDepartmentSchema, DepartmentDto } from "../schemas/createLaboratorySchema";

interface UseFormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: Partial<DepartmentDto>;
  t: (key: string) => string;
}

export const useDepartmentForm = ({
  mode,
  id,
  initialData,
  t,
}: UseFormProps): {
    form: UseFormReturn<DepartmentDto, undefined, DepartmentDto>;
    onSubmit: (data: DepartmentDto) => Promise<void>;
    mutation: ReturnType<typeof useMutation<any, AxiosError, DepartmentDto>>;
} => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const form = useForm<DepartmentDto, undefined, DepartmentDto>({
    //@ts-ignore
    resolver: zodResolver(createDepartmentSchema(t)), // t uzatiladi
    defaultValues: {
      title_uz: get(initialData, "title_uz", ""),
      title_ru: get(initialData, "title_ru", ""),
      title_en: get(initialData, "title_en", ""),
      description_uz: get(initialData, "description_uz", ""),
      description_ru: get(initialData, "description_ru", ""),
      description_en: get(initialData, "description_en", ""),
      position: get(initialData, "position"),
      slug: get(initialData, "slug", ""),
      sub_title_uz: get(initialData, "sub_title_uz", ""),
      sub_title_ru: get(initialData, "sub_title_ru", ""),
      sub_title_en: get(initialData, "sub_title_en", ""),
      status: get(initialData, "status", true),
    },
  });

  const mutation = useMutation<unknown, AxiosError, DepartmentDto>({
    mutationFn: (data: DepartmentDto) =>
      mode === "create" ? createDepartment(data) : updateDepartment(id!, data),
    onSuccess: () => {
      toastService.success(t("Saved successfully"));
      navigate("/dashboard/departments");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error: AxiosError) => {
      const message = (error.response?.data as any)?.detail || error.message;
      toastService.error(message || t("An error occurred"));
    },
  });

  const onSubmit = async (data: DepartmentDto) => {
    await mutation.mutateAsync(data);
  };

  return { form, onSubmit, mutation };
};
