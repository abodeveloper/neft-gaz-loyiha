import api from "@/lib/axios";
import { cleanParams } from "@/shared/utils/api.utils";

export const getApplicationsData = async (
  page: number,
  search: string,
) => {

  const url = `/parts/applications/`;

  const params = cleanParams({
    page,
    search,
  })

  const response = await api.get(url, {
    params
  });
  return response.data;
};

export const getApplicationById = async (id: string | number | undefined) => {
  const response = await api.get(`/parts/applications/${id}/`);
  return response.data;
};

export const deleteApplication = async (id: number) => {
  const response = await api.delete(`/parts/applications/${id}/`);
  return response.data;
};