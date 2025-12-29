import api from "@/lib/axios";
import { cleanParams } from "@/shared/utils/api.utils";
import { NewDto } from "../schemas/createNewSchema";

export const getNewsData = async (
  page: number,
  search: string,
  filterQuery: Record<string, any>
) => {

  const url = `/api/posts/`;

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

  // --- PAGES (TO'G'IRLANGAN) ---
  if (data.pages && data.pages.length > 0) {
    data.pages.forEach((item) => {
      // Agar item string bo'lib qolgan bo'lsa ham baribir append qilaveramiz,
      // chunki FormData baribir stringga o'giradi.
      formData.append("pages", item.toString());
    });
  }

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

  // 1. Oddiy matnli maydonlarni avtomatik qo'shish (qayta-qayta if yozmaslik uchun)
  const textFields = [
    "title_uz", "title_ru", "title_en",
    "description_uz", "description_ru", "description_en",
    "type"
  ] as const;

  textFields.forEach((field) => {
    if (data[field]) formData.append(field, data[field] as string);
  });

  // 2. Status (boolean yoki 0 bo'lishi mumkinligi uchun alohida tekshiramiz)
  if (data.status !== undefined) {
    formData.append("status", data.status.toString());
  }

  // 3. PAGES - Arrayni to'g'ri yuborish (Sizdagi asosiy muammo shu edi)
  if (data.pages && data.pages.length > 0) {
    data.pages.forEach((pageId) => {
      // Har bir ID ni alohida append qilamiz
      formData.append("pages", pageId.toString());
    });
  }

  // 4. RASMLAR LOGIKASI
  if (Array.isArray(data.images)) {
    data.images.forEach((item: any) => {
      if (item instanceof File) {
        // Yangi yuklanayotgan fayllar
        formData.append("upload_images", item);
      } else if (item.id) {
        // Eski saqlanib qolgan rasmlarning IDsi
        formData.append("exists_image_ids", item.id.toString());
      }
    });
  }

  const response = await api.patch(`/api/posts/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
