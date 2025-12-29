import api from "@/lib/axios";
import { cleanParams } from "@/shared/utils/api.utils";
import { EducationDto } from "../schemas/createEducationSchema";

export const getEducationsData = async (
  page: number,
  search: string,
  filterQuery: Record<string, any>
) => {

  const url = `/menu/postgraduate-education/`;

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

export const getEducationById = async (id: string | number | undefined) => {
  const response = await api.get(`/menu/postgraduate-education/${id}/`);
  return response.data;
};

export const deleteEducation = async (id: number) => {
  const response = await api.delete(`/menu/postgraduate-education/${id}/`);
  return response.data;
};

export const createEducation = async (data: EducationDto) => {
  // FormData o'rniga to'g'ridan-to'g'ri 'data' ni yuboramiz
  const response = await api.post("/menu/postgraduate-education/", data);
  return response.data;
};

export const updateEducation = async (id: number | string, data: EducationDto) => {
  // Update uchun ham xuddi shunday
  const response = await api.patch(`/menu/postgraduate-education/${id}/`, data);
  return response.data;
};