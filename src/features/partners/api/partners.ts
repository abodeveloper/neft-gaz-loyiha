import api from "@/lib/axios";
import { cleanParams } from "@/shared/utils/api.utils";
import { PartnerDto } from "../schemas/createPartnerSchema";

export const getPartnersData = async (
  search: string,
  filterQuery: Record<string, any>
) => {

  const url = `/parts/collaborations/`;

  const params = cleanParams({
    search,
    ...filterQuery
  })

  const response = await api.get(url, {
    params
  });
  return response.data;
};

export const getPartnerById = async (id: string | number | undefined) => {
  const response = await api.get(`/parts/collaborations/${id}/`);
  return response.data;
};

export const deletePartner = async (id: number) => {
  const response = await api.delete(`/parts/collaborations/${id}/`);
  return response.data;
};

export const createPartner = async (data: PartnerDto) => {
  const formData = new FormData();
  if (data.title_uz) formData.append("title_uz", data.title_uz);
  if (data.title_ru) formData.append("title_ru", data.title_ru);
  if (data.title_en) formData.append("title_en", data.title_en);
  if (data.link) formData.append("link", data.link);

  if (data.position) formData.append("position", data.position);
  if (data.status !== undefined) formData.append("status", String(data.status));

  if (data.image instanceof File) {
    formData.append("image", data.image);
  }

  const response = await api.post("/parts/collaborations/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updatePartner = async (
  id: number,
  data: Partial<PartnerDto>
) => {
  // 1. Agar rasm o'zgarmagan bo'lsa (File emas), JSON yuboramiz
  if (!(data.image instanceof File)) {
    const payload = {
      title_uz: data.title_uz,
      title_ru: data.title_ru,
      title_en: data.title_en,
      link: data.link,
      position: data.position,
      status: data.status,
    };

    // undefined/null qiymatlarni tozalash
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
    );

    const response = await api.patch(`/parts/collaborations/${id}/`, filteredPayload);
    return response.data;
  }

  // 2. Agar yangi rasm bo'lsa, FormData ishlatamiz
  const formData = new FormData();

  // Matnli maydonlarni qo'shish
  if (data.title_uz) formData.append("title_uz", data.title_uz);
  if (data.title_ru) formData.append("title_ru", data.title_ru);
  if (data.title_en) formData.append("title_en", data.title_en);
  if (data.link) formData.append("link", data.link);

  if (data.position) formData.append("position", data.position);
  if (data.status !== undefined) formData.append("status", String(data.status));

  // Rasmni qo'shish
  formData.append("image", data.image);

  const response = await api.patch(`/parts/collaborations/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
