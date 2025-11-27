import api from "@/lib/axios";
import { MenuPageDto } from "../schemas/updateMenuPageSchema";
import { MenuPage } from "../types";

export const getAllMenuPages = async (): Promise<MenuPage[]> => {
  const { data } = await api.get("/menu/all-pages/");
  return data;
};

export const getMenuPagesData = async (
  page: number,
  search: string,
  filterQuery: string
) => {
  let url = `/menu/pages/?page=${page}`;
  if (search) {
    url += `&search=${search}`;
  }
  if (filterQuery) {
    url += `&${filterQuery}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const getMenuPageById = async (id: string | number | undefined) => {
  const response = await api.get(`/menu/pages/${id}/`);
  return response.data;
};

export const updateMenuPage = async (
  id: number,
  data: Partial<MenuPageDto>
) => {
  // yuboriladigan obyekt
  const payload = {
    description_uz: data.description_uz,
    description_ru: data.description_ru,
    description_en: data.description_en,
  };

  // null yoki undefined bo‘lganlarni olib tashlaymiz
  const filteredPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
  );

  const response = await api.patch(`/menu/pages/${id}/`, filteredPayload);
  return response.data;
};

export const getMenuPageEmployeesData = async (
  page: number,
  search: string,
  filterQuery: string
) => {
  let url = `/menu/pages/?page=${page}`;
  if (search) {
    url += `&search=${search}`;
  }
  if (filterQuery) {
    url += `&${filterQuery}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const getPageEmployeesData = async (pageId?: string, search?: string) => {
  let url = `/menu/employees/?page=${pageId}`;

  if (search) {
    // search bo‘lsa, ?search= qo‘shamiz
    url += `&search=${encodeURIComponent(search)}`;
  }

  const response = await api.get(url);
  return response.data;
};