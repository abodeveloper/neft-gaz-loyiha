import api from "@/lib/axios";
import { NewDto } from "../schemas/createNewSchema";

export const getNewsData = async (
  page: number,
  search: string,
  filterQuery: string
) => {
  let url = `/api/posts/?page=${page}`;
  if (search) {
    url += `&search=${search}`;
  }
  if (filterQuery) {
    url += `&${filterQuery}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const getNewsById = async (id: string | number | undefined) => {
  const response = await api.get(`/api/posts/${id}/`);
  return response.data;
};

export const deleteNews = async (id: number) => {
  const response = await api.delete(`/api/posts/${id}/`);
  return response.data;
};

export const createNew = async (data: NewDto) => {
  const formData = new FormData();

  // Matnli maydonlar
  formData.append("title_uz", data.title_uz);
  if (data.title_ru) formData.append("title_ru", data.title_ru);
  if (data.title_en) formData.append("title_en", data.title_en);
  if (data.description_uz) formData.append("description_uz", data.description_uz);
  if (data.description_ru) formData.append("description_ru", data.description_ru);
  if (data.description_en) formData.append("description_en", data.description_en);
  formData.append("type", data.type);
  formData.append("status", data.status.toString());

  // --- RASMLAR LOGIKASI (CREATE) ---
  // Create da faqat yangi fayllar bo'ladi, lekin baribir tekshiramiz
  if (Array.isArray(data.images)) {
    data.images.forEach((item: any) => {
      if (item instanceof File) {
        // Backend "upload_images" nomini kutayotgan bo'lsa:
        formData.append("upload_images", item);
      }
    });
  }

  const response = await api.post("/api/posts/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateNew = async (id: number, data: Partial<NewDto>) => {
  const formData = new FormData();

  // Matnli maydonlar
  if (data.title_uz) formData.append("title_uz", data.title_uz);
  if (data.title_ru) formData.append("title_ru", data.title_ru);
  if (data.title_en) formData.append("title_en", data.title_en);
  if (data.description_uz) formData.append("description_uz", data.description_uz);
  if (data.description_ru) formData.append("description_ru", data.description_ru);
  if (data.description_en) formData.append("description_en", data.description_en);
  if (data.type) formData.append("type", data.type);
  if (data.status !== undefined) formData.append("status", data.status.toString());

  // --- RASMLAR LOGIKASI (UPDATE) ---
  // Bu yerda data.images massiv bo'ladi
  if (Array.isArray(data.images)) {
    data.images.forEach((item: any) => {
      if (item instanceof File) {
        // 1. Agar bu YANGI fayl bo'lsa, uni fayl sifatida yuklaymiz
        formData.append("upload_images", item);
      } else if (item.id) {
        // 2. Agar bu ESKI fayl bo'lsa (backenddan kelgan object), uning ID sini yuboramiz.
        // Backend shu ID larni ko'rib, bularni o'chirmaslik kerakligini tushunadi.
        // Eslatma: Backendda buni qabul qiluvchi field nomi "existing_ids" yoki shunga o'xshash bo'lishi mumkin.
        // Agar backend faqat "upload_images" kutsa va eskilarni boshqarolmasa, bu qismni backendchi bilan gaplashing.
        formData.append("existing_ids", item.id.toString());
      }
    });
  }

  console.log("FormData for update:", formData);

  const response = await api.patch(`/api/posts/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
