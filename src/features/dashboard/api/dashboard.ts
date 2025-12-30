import api from "@/lib/axios";

export const getDashboardData = async (
) => {

  const url = `/main/dashboard/`;

  const response = await api.get(url);
  return response.data;
};