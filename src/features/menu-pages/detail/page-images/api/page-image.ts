import api from "@/lib/axios";
import { PageImageDto } from "../schemas/createPageImageSchema";

export const getPageImagesData = async (pageId?: string, search?: string) => {
  let url = `/menu/page-images/?page=${pageId}`;

  if (search) {
    // search bo‘lsa, ?search= qo‘shamiz
    url += `&search=${encodeURIComponent(search)}`;
  }

  const response = await api.get(url);
  return response.data;
};

export const getPageImageById = async (id: string | number | undefined) => {
  const response = await api.get(`/menu/page-images/${id}/`);
  return response.data;
};

export const deletePageImage = async (id: number) => {
  const response = await api.delete(`/menu/page-images/${id}/`);
  return response.data;
};

export const createPageImage = async (data: PageImageDto) => {
  const formData = new FormData();
  if (data.page) formData.append("page", data.page);
  if (data.image instanceof File) {
    formData.append("image", data.image);
  }

  const response = await api.post("/menu/page-images/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updatePageImages = async (id: number, data: Partial<PageImageDto>) => {
  // Agar rasm File bo‘lmasa (ya’ni allaqachon mavjud bo‘lsa yoki string bo‘lsa)
  // u holda JSON orqali yuboramiz
  if (!(data.image instanceof File)) {
    const payload = {
      page: data.page,
      image: data.image, // string URL bo‘lishi mumkin
    };

    // undefined va null qiymatlarni olib tashlaymiz
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
    );

    const response = await api.patch(
      `/menu/page-images/${id}/`,
      filteredPayload
    );
    return response.data;
  }

  // Agar yangi rasm yuklanayotgan bo‘lsa, FormData kerak bo‘ladi
  const formData = new FormData();
  if (data.page) formData.append("page", data.page);
  if (data.image instanceof File) formData.append("image", data.image);

  const response = await api.patch(`/menu/page-images/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
