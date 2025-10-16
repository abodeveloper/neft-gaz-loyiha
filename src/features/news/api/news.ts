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
  formData.append("title_uz", data.title_uz);
  if (data.title_ru) formData.append("title_ru", data.title_ru);
  if (data.title_en) formData.append("title_en", data.title_en);
  if (data.description_uz)
    formData.append("description_uz", data.description_uz);
  if (data.description_ru)
    formData.append("description_ru", data.description_ru);
  if (data.description_en)
    formData.append("description_en", data.description_en);
  formData.append("type", data.type);
  formData.append("status", data.status.toString());
  if (data.image instanceof File) {
    formData.append("image", data.image);
  }

  console.log("FormData for createNew:", Array.from(formData.entries())); // Debug

  const response = await api.post("/api/posts/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateNew = async (id: number, data: Partial<NewDto>) => {
  const formData = new FormData();
  if (data.title_uz) formData.append("title_uz", data.title_uz);
  if (data.title_ru) formData.append("title_ru", data.title_ru);
  if (data.title_en) formData.append("title_en", data.title_en);
  if (data.description_uz)
    formData.append("description_uz", data.description_uz);
  if (data.description_ru)
    formData.append("description_ru", data.description_ru);
  if (data.description_en)
    formData.append("description_en", data.description_en);
  if (data.type) formData.append("type", data.type);
  if (data.status !== undefined)
    formData.append("status", data.status.toString());
  if (data.image instanceof File) {
    formData.append("image", data.image);
  }

  console.log("FormData for updateNew:", Array.from(formData.entries())); // Debug

  const response = await api.patch(`/api/posts/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

