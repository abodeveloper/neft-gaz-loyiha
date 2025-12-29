import api from "@/lib/axios";
import { cleanParams } from "@/shared/utils/api.utils";
import { EmployeeDto } from "../schemas/createEmployeeSchema";

export const getEmployeesDataByPage = async (
  page: number,
  pageId: string | undefined,
  search: string,
) => {

  const url = `/menu/employees/`;

  const params = cleanParams({
    page,
    page_id: pageId,
    search,
  })

  const response = await api.get(url, {
    params
  });
  return response.data;
};

export const getEmployeesData = async (
  page: number,
  search: string,
) => {

  const url = `/menu/employees/`;

  const params = cleanParams({
    page,
    search,
  })

  const response = await api.get(url, {
    params
  });
  return response.data;
};

export const getEmployeeById = async (id: string | number | undefined) => {
  const response = await api.get(`/menu/employees/${id}/`);
  return response.data;
};

export const deleteEmployee = async (id: number) => {
  const response = await api.delete(`/menu/employees/${id}/`);
  return response.data;
};

export const createEmployee = async (data: EmployeeDto) => {
  const formData = new FormData();
  formData.append("full_name_uz", data.full_name_uz);
  if (data.full_name_ru) formData.append("full_name_ru", data.full_name_ru);
  if (data.full_name_en) formData.append("full_name_en", data.full_name_en);

  if (data.position_uz) formData.append("position_uz", data.position_uz);
  if (data.position_ru) formData.append("position_ru", data.position_ru);
  if (data.position_en) formData.append("position_en", data.position_en);

  if (data.description_uz)
    formData.append("description_uz", data.description_uz);
  if (data.description_ru)
    formData.append("description_ru", data.description_ru);
  if (data.description_en)
    formData.append("description_en", data.description_en);

  if (data.phone) formData.append("phone", data.phone);
  if (data.email) formData.append("email", data.email);
  if (data.order) formData.append("order", data.order);

  // --- PAGES (TO'G'IRLANGAN) ---
  if (data.pages && data.pages.length > 0) {
    data.pages.forEach((item) => {
      // Agar item string bo'lib qolgan bo'lsa ham baribir append qilaveramiz,
      // chunki FormData baribir stringga o'giradi.
      formData.append("pages", item.toString());
    });
  }

  if (data.image instanceof File) {
    formData.append("image", data.image);
  }

  const response = await api.post("/menu/employees/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateEmployeee = async (
  id: number,
  data: Partial<EmployeeDto>
) => {
  // 1. Agar rasm o'zgarmagan bo'lsa (File emas), JSON yuboramiz
  if (!(data.image instanceof File)) {
    const payload = {
      full_name_uz: data.full_name_uz,
      full_name_ru: data.full_name_ru,
      full_name_en: data.full_name_en,
      position_uz: data.position_uz,
      position_ru: data.position_ru,
      position_en: data.position_en,
      description_uz: data.description_uz,
      description_ru: data.description_ru,
      description_en: data.description_en,
      phone: data.phone,
      email: data.email,
      order: data.order,
      // image ni yuborish shart emas agar u o'zgarmagan bo'lsa (yoki backend string qabul qilsa qoldiring)
      // pages JSON da array bo'lib ketaveradi, bu to'g'ri
      pages: data.pages?.map((item) => Number(item)) || [],
    };

    // undefined/null qiymatlarni tozalash
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
    );

    const response = await api.patch(`/menu/employees/${id}/`, filteredPayload);
    return response.data;
  }

  // 2. Agar yangi rasm bo'lsa, FormData ishlatamiz
  const formData = new FormData();

  // Matnli maydonlarni qo'shish
  if (data.full_name_uz) formData.append("full_name_uz", data.full_name_uz);
  if (data.full_name_ru) formData.append("full_name_ru", data.full_name_ru);
  if (data.full_name_en) formData.append("full_name_en", data.full_name_en);

  if (data.position_uz) formData.append("position_uz", data.position_uz);
  if (data.position_ru) formData.append("position_ru", data.position_ru);
  if (data.position_en) formData.append("position_en", data.position_en);

  if (data.description_uz) formData.append("description_uz", data.description_uz);
  if (data.description_ru) formData.append("description_ru", data.description_ru);
  if (data.description_en) formData.append("description_en", data.description_en);

  if (data.phone) formData.append("phone", data.phone);
  if (data.email) formData.append("email", data.email);
  if (data.order) formData.append("order", data.order);

  // --- MUHIM O'ZGARISH (PAGES) ---
  if (data.pages && data.pages.length > 0) {
    data.pages.forEach((item) => {
      // Har bir ID ni alohida append qilamiz
      formData.append("pages", item.toString());
    });
  }

  // Rasmni qo'shish
  formData.append("image", data.image);

  const response = await api.patch(`/menu/employees/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
