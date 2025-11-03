import api from "@/lib/axios";
import { MenuDto } from "../schemas/createMenuSchema";
import { Menu } from "../types";

export const getAllMenus = async (): Promise<Menu[]> => {
  const { data } = await api.get("/menu/menus/");
  return data;
};

export const getMenusData = async (search: string, filterQuery?: string) => {
  let url = `/menu/menus/`;

  if (search) {
    // search bo‘lsa, ?search= qo‘shamiz
    url += `?search=${encodeURIComponent(search)}`;
  }

  if (filterQuery) {
    // filterQuery allaqachon & bilan boshlanadi
    // agar search bo‘lmasa, ? ni qo‘shib, & ni olib tashlaymiz
    if (!search && filterQuery.startsWith("&")) {
      url += `?${filterQuery.slice(1)}`;
    } else {
      url += filterQuery;
    }
  }

  const response = await api.get(url);
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
  const formData = new FormData();
  if (data.title_uz) formData.append("title_uz", data.title_uz);
  if (data.title_ru) formData.append("title_ru", data.title_ru);
  if (data.title_en) formData.append("title_en", data.title_en);

  const slug = sanitizeSlug(data.page_slug, data.title_uz);

  if (slug) formData.append("page_slug", slug);
  if (data.position) formData.append("position", data.position);
  if (data.status !== undefined)
    formData.append("status", data.status.toString());

  const response = await api.patch(`/menu/menus/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
