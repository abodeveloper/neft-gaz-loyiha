import api from "@/lib/axios";
import { cleanParams } from "@/shared/utils/api.utils";
import { PageFileDto } from "../schemas/createPageFileSchema";

export const getPageFilesData = async (
  pageId?: string | undefined,
  search?: string | undefined,
) => {

  const url = `/menu/page-files/`;

  const params = cleanParams({
    page: pageId,
    search,
  })

  const response = await api.get(url, {
    params
  });
  return response.data;
};

export const getPageFileById = async (id: string | number | undefined) => {
  const response = await api.get(`/menu/page-files/${id}/`);
  return response.data;
};

export const deletePageFile = async (id: number) => {
  const response = await api.delete(`/menu/page-files/${id}/`);
  return response.data;
};

export const createPageFile = async (data: PageFileDto) => {
  const formData = new FormData();
  if (data.page) formData.append("page", data.page.toString());
  formData.append("title_uz", data.title_uz);
  if (data.title_ru) formData.append("title_ru", data.title_ru);
  if (data.title_en) formData.append("title_en", data.title_en);
  if (data.position) formData.append("position", data.position.toString());
  formData.append("status", data.status.toString());

  if (data.file instanceof File) {
    formData.append("file", data.file);
  }

  const response = await api.post("/menu/page-files/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updatePageFile = async (
  id: number,
  data: Partial<PageFileDto>
) => {
  if (!(data.file instanceof File)) {
    const payload = {
      page: data.page,
      title_uz: data.title_uz,
      title_ru: data.title_ru,
      title_en: data.title_en,
      position: data.position,
      status: data.status,
      file: data.file, // string URL bo‘lishi mumkin
    };

    // undefined va null qiymatlarni olib tashlaymiz
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
    );

    const response = await api.patch(
      `/menu/page-files/${id}/`,
      filteredPayload
    );
    return response.data;
  }

  const formData = new FormData();
  if (data.page) formData.append("page", data.page.toString());
  if (data.title_uz) formData.append("title_uz", data.title_uz);
  if (data.title_ru) formData.append("title_ru", data.title_ru);
  if (data.title_en) formData.append("title_en", data.title_en);
  if (data.position) formData.append("position", data.position.toString());
  if (data.status) formData.append("status", data.status.toString());

  formData.append("file", data.file);

  const response = await api.patch(`/menu/page-files/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
