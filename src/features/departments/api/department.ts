import api from "@/lib/axios";
import { cleanParams } from "@/shared/utils/api.utils";
import { DepartmentDto } from "../schemas/createLaboratorySchema";

export const getDepartmentsData = async (
  page: number,
  search: string,
  filterQuery: Record<string, any>
) => {

  const url = `/menu/departments/`;

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

export const getDepartmentById = async (id: string | number | undefined) => {
  const response = await api.get(`/menu/departments/${id}/`);
  return response.data;
};

export const deleteDepartment = async (id: number) => {
  const response = await api.delete(`/menu/departments/${id}/`);
  return response.data;
};

export const createDepartment = async (data: DepartmentDto) => {
  // FormData o'rniga to'g'ridan-to'g'ri 'data' ni yuboramiz
  const response = await api.post("/menu/departments/", data);
  return response.data;
};

export const updateDepartment = async (id: number | string, data: DepartmentDto) => {
  // Update uchun ham xuddi shunday
  const response = await api.patch(`/menu/departments/${id}/`, data);
  return response.data;
};