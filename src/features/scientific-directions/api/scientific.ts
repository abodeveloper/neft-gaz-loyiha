import api from "@/lib/axios";
import { cleanParams } from "@/shared/utils/api.utils";
import { ScientificDto } from "../schemas/createScientificSchema";

export const getScientificData = async (
  page: number,
  search: string,
  filterQuery: Record<string, any>
) => {

  const url = `/menu/scientific-direction/`;

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

export const getScientificById = async (id: string | number | undefined) => {
  const response = await api.get(`/menu/scientific-direction/${id}/`);
  return response.data;
};

export const deleteScientific = async (id: number) => {
  const response = await api.delete(`/menu/scientific-direction/${id}/`);
  return response.data;
};

export const createScientific = async (data: ScientificDto) => {
  // FormData o'rniga to'g'ridan-to'g'ri 'data' ni yuboramiz
  const response = await api.post("/menu/scientific-direction/", data);
  return response.data;
};

export const updateScientific = async (id: number | string, data: ScientificDto) => {
  // Update uchun ham xuddi shunday
  const response = await api.patch(`/menu/scientific-direction/${id}/`, data);
  return response.data;
};