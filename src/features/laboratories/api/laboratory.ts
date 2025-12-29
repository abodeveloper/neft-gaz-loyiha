import api from "@/lib/axios";
import { cleanParams } from "@/shared/utils/api.utils";
import { LaboratoryDto } from "../schemas/createLaboratorySchema";

export const getLaboratoriesData = async (
  page: number,
  search: string,
  filterQuery: Record<string, any>
) => {

  const url = `/menu/laboratories/`;

  const params = cleanParams({
    page,
    search,
    ...filterQuery
  })

  const response = await api.get(url, {
    params
  });
  return response.data;
};

export const getLaboratoryById = async (id: string | number | undefined) => {
  const response = await api.get(`/menu/laboratories/${id}/`);
  return response.data;
};

export const deleteLaboratory = async (id: number) => {
  const response = await api.delete(`/menu/laboratories/${id}/`);
  return response.data;
};

export const createLaboratory = async (data: LaboratoryDto) => {
  const formData = new FormData();

  // Matnli maydonlar
  formData.append("title_uz", data.title_uz);
  if (data.title_ru) formData.append("title_ru", data.title_ru);
  if (data.title_en) formData.append("title_en", data.title_en);
  if (data.description_uz) formData.append("description_uz", data.description_uz);
  if (data.description_ru) formData.append("description_ru", data.description_ru);
  if (data.description_en) formData.append("description_en", data.description_en);
  
  if (data.slug) formData.append("slug", data.slug);

  formData.append("position", data.position);
  formData.append("status", data.status.toString());

  // Create da faqat yangi fayllar bo'ladi, lekin baribir tekshiramiz
  if (Array.isArray(data.images)) {
    data.images.forEach((item: any) => {
      if (item instanceof File) {
        // Backend "upload_images" nomini kutayotgan bo'lsa:
        formData.append("upload_images", item);
      }
    });
  }

  const response = await api.post("/menu/laboratories/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateLaboratory = async (id: number | string, data: LaboratoryDto) => {
  const formData = new FormData();

  formData.append("title_uz", data.title_uz);
  if (data.title_ru) formData.append("title_ru", data.title_ru);
  if (data.title_en) formData.append("title_en", data.title_en);

  if (data.description_uz) formData.append("description_uz", data.description_uz);
  if (data.description_ru) formData.append("description_ru", data.description_ru);
  if (data.description_en) formData.append("description_en", data.description_en);

  if (data.slug) formData.append("slug", data.slug);

  formData.append("position", data.position);
  formData.append("status", data.status.toString());

  if (Array.isArray(data.images)) {
    data.images.forEach((item: any) => {
      if (item instanceof File) {
        // Yangi yuklanayotgan fayllar (File obyekti)
        formData.append("upload_images", item);
      } else if (item.id) {
        // Eski saqlanib qolgan rasmlarning IDsi
        formData.append("exists_image_ids", item.id.toString());
      }
    });
  }

  const response = await api.patch(`/menu/laboratories/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};