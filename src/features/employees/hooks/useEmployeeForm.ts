import { toastService } from "@/lib/toastService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { get, omit } from "lodash";
import { useForm, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createEmployee, updateEmployeee } from "../api/employees";
import {
  createEmployeeSchema,
  EmployeeDto,
} from "../schemas/createEmployeeSchema";

interface UseFormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: Partial<EmployeeDto>;
  t: (key: string) => string;
}

export const useEmployeeForm = ({
  mode,
  id,
  initialData,
  t,
}: UseFormProps): {
  form: UseFormReturn<EmployeeDto, undefined, EmployeeDto>;
  onSubmit: (data: EmployeeDto) => Promise<void>;
  mutation: ReturnType<typeof useMutation<any, AxiosError, EmployeeDto>>;
} => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const form = useForm<EmployeeDto, undefined, EmployeeDto>({
    //@ts-ignore
    resolver: zodResolver(createEmployeeSchema(t)), // t uzatiladi
    defaultValues: {
      full_name_uz: get(initialData, "full_name_uz", ""),
      full_name_ru: get(initialData, "full_name_ru", ""),
      full_name_en: get(initialData, "full_name_en", ""),
      position_uz: get(initialData, "position_uz", ""),
      position_ru: get(initialData, "position_ru", ""),
      position_en: get(initialData, "position_en", ""),
      description_uz: get(initialData, "description_uz", ""),
      description_ru: get(initialData, "description_ru", ""),
      description_en: get(initialData, "description_en", ""),
      phone: get(initialData, "phone", ""),
      email: get(initialData, "email", ""),
      order: get(initialData, "order"),
      image: get(initialData, "image", null),
      pages: get(initialData, "pages", []),
    },
  });

  const mutation = useMutation<unknown, AxiosError, EmployeeDto>({
    mutationFn: (data: EmployeeDto) =>
      mode === "create" ? createEmployee(data) : updateEmployeee(id!, data),
    onSuccess: () => {
      toastService.success(t("Saved successfully"));
      navigate("/dashboard/employees");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error: AxiosError) => {
      const message = (error.response?.data as any)?.detail || error.message;
      toastService.error(message || t("An error occurred"));
    },
  });

  const onSubmit = async (data: EmployeeDto) => {
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
