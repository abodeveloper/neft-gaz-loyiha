import api from "@/lib/axios";
import { cleanParams } from "@/shared/utils/api.utils";
import { MenuDto } from "../schemas/createMenuSchema";
import { Menu } from "../types";

export const getAllMenus = async (): Promise<Menu[]> => {
  const { data } = await api.get("/menu/menus/");
  return data;
};

export const getMenusData = async (
  search: string,
  filterQuery: Record<string, any>
) => {

  const url = `/menu/menus/`;

  const params = cleanParams({
    search,
    ...filterQuery
  })

  const response = await api.get(url, {
    params
  });
  return response.data;
};

export const getMenuById = async (id: string | number | undefined) => {
  const response = await api.get(`/menu/menus/${id}/`);
  return response.data;
};

export const deleteMenu = async (id: number) => {
  const response = await api.delete(`/menu/menus/${id}/`);
  return response.data;
};

// 🔹 Slugni tayyorlovchi funksiya
const sanitizeSlug = (slug?: string, fallback?: string) => {
  const value = slug || fallback || "";
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // bo‘sh joylarni "-" ga almashtiradi
    .replace(/[^a-z0-9-]/g, "") // harflar, raqamlar va "-" dan boshqa narsani olib tashlaydi
    .replace(/--+/g, "-") // ketma-ket kelgan chiziqchalarni bitta qiladi
    .replace(/^-|-$/g, ""); // boshida yoki oxiridagi "-" ni olib tashlaydi
};

export const createMenu = async (data: MenuDto) => {
  const slug = sanitizeSlug(data.page_slug, data.title_uz);

  const payload = {
    parent: data.parent,
    title_uz: data.title_uz,
    title_ru: data.title_ru || undefined,
    title_en: data.title_en || undefined,
    has_page: data.has_page,
    page_slug: data.has_page ? slug : null,
    position: data.position || undefined,
    status: data.status,
  };

  const response = await api.post("/menu/menus/", payload);
  return response.data;
};

export const updateMenu = async (id: number, data: Partial<MenuDto>) => {
  // slugni tayyorlab olish
  const slug = sanitizeSlug(data.page_slug, data.title_uz);

  // yuboriladigan obyekt
  const payload = {
    parent: data.parent,
    title_uz: data.title_uz,
    title_ru: data.title_ru,
    title_en: data.title_en,
    has_page: data.has_page,
    page_slug: data.has_page ? slug : null,
    position: data.position,
    status: data.status,
  };

  // null yoki undefined bo‘lganlarni olib tashlaymiz
  const filteredPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
  );

  const response = await api.patch(`/menu/menus/${id}/`, filteredPayload);
  return response.data;
};
