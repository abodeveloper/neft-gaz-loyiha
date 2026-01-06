import { toastService } from "@/lib/toastService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { get } from "lodash";
import { useForm, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { updateCompany } from "../api/company";
import { CompanyDto, createCompanySchema } from "../schemas/createCompanySchema";

interface UseFormProps {
  initialData?: Partial<CompanyDto>;
  t: (key: string) => string;
}

export const useCompanyForm = ({
  initialData,
  t,
}: UseFormProps): {
    form: UseFormReturn<CompanyDto, undefined, CompanyDto>;
  onSubmit: (data: CompanyDto) => Promise<void>;
  mutation: ReturnType<typeof useMutation<any, AxiosError, CompanyDto>>;
} => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const form = useForm<CompanyDto, undefined, CompanyDto>({
    //@ts-ignore
    resolver: zodResolver(createCompanySchema(t)), // t uzatiladi
    defaultValues: {
      name_uz: get(initialData, "name_uz", ""),
      name_ru: get(initialData, "name_ru", ""),
      name_en: get(initialData, "name_en", ""),
      address_uz: get(initialData, "address_uz", ""),
      address_ru: get(initialData, "address_ru", ""),
      address_en: get(initialData, "address_en", ""),
      stat_1: get(initialData, "stat_1", ""),
      stat_2: get(initialData, "stat_2", ""),
      stat_3: get(initialData, "stat_3", ""),
      stat_4: get(initialData, "stat_4", ""),
      instagram: get(initialData, "instagram", ""),
      telegram: get(initialData, "telegram", ""),
      facebook: get(initialData, "facebook", ""),
      youtube: get(initialData, "youtube", ""),
      linkedin: get(initialData, "linkedin", ""),
      phone_number: get(initialData, "phone_number", ""),
      email: get(initialData, "email", ""),
      logo: get(initialData, "logo", ""),
    },
  });

  const mutation = useMutation<unknown, AxiosError, CompanyDto>({
    mutationFn: (data: CompanyDto) =>
      updateCompany(data),
    onSuccess: () => {
      toastService.success(t("Saved successfully"));
      navigate("/dashboard/company");
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
    onError: (error: AxiosError) => {
      const message = (error.response?.data as any)?.detail || error.message;
      toastService.error(message || t("An error occurred"));
    },
  });

  const onSubmit = async (data: CompanyDto) => {
    await mutation.mutateAsync(data);
  };

  return { form, onSubmit, mutation };
};
