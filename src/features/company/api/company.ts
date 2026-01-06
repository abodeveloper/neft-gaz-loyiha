import api from "@/lib/axios";
import { CompanyDto } from "../schemas/createCompanySchema";

export const getCompanyData = async () => {
  const response = await api.get(`/main/company/`);
  return response.data;
};

export const updateCompany = async (data: CompanyDto) => {
  const formData = new FormData();

  if (data.name_uz) formData.append("name_uz", data.name_uz);
  if (data.name_ru) formData.append("name_ru", data.name_ru);
  if (data.name_en) formData.append("name_en", data.name_en);

  if (data.address_uz) formData.append("address_uz", data.address_uz);
  if (data.address_ru) formData.append("address_ru", data.address_ru);
  if (data.address_en) formData.append("address_en", data.address_en);
  
  if (data.stat_1) formData.append("stat_1", data.stat_1);
  if (data.stat_2) formData.append("stat_2", data.stat_2);
  if (data.stat_3) formData.append("stat_3", data.stat_3);
  if (data.stat_4) formData.append("stat_4", data.stat_4);

  if (data.instagram) formData.append("instagram", data.instagram);
  if (data.telegram) formData.append("telegram", data.telegram);
  if (data.facebook) formData.append("facebook", data.facebook);
  if (data.youtube) formData.append("youtube", data.youtube);
  if (data.linkedin) formData.append("linkedin", data.linkedin);

  if (data.phone_number) formData.append("phone_number", data.phone_number);
  if (data.email) formData.append("email", data.email);

  // Agar bo'sh string kelsa o'tkazib yuborish uchun
  if (data.logo instanceof File) {
    formData.append("logo", data.logo);
  } 

  const response = await api.patch(`/main/company/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};