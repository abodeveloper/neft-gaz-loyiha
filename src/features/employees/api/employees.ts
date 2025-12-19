import api from "@/lib/axios";
import { EmployeeDto } from "../schemas/createEmployeeSchema";


export const getEmployeesDataByPage = async (
  page: number,
  pageId: string | undefined,
  search?: string,
  filterQuery?: string
) => {
  let url = `/menu/employees/?page=${page}&page_id=${pageId}`;
  if (search) {
    url += `&search=${search}`;
  }
  if (filterQuery) {
    url += `&${filterQuery}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const getEmployeesData = async (
  page: number,
  search?: string,
  filterQuery?: string
) => {
  let url = `/menu/employees/?page=${page}`;
  if (search) {
    url += `&search=${search}`;
  }
  if (filterQuery) {
    url += `&${filterQuery}`;
  }
  const response = await api.get(url);
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

  if (data.pages && data.pages.length > 0) {

    const pages = data.pages.map((item) =>
      typeof item === "string" ? Number(item) : item
    );

    formData.append(
      "pages",
      pages as unknown as string
    );
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
  // Agar rasm File bo‘lmasa (ya’ni allaqachon mavjud bo‘lsa yoki string bo‘lsa)
  // u holda JSON orqali yuboramiz
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
      image: data.image, // string URL bo‘lishi mumkin
      // pages: data.pages,
      pages:
        data.pages?.map((item) =>
          typeof item === "string" ? Number(item) : item
        ) || [],
      //
    };

    // undefined va null qiymatlarni olib tashlaymiz
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
    );

    const response = await api.patch(`/menu/employees/${id}/`, filteredPayload);
    return response.data;
  }

  // Agar yangi rasm yuklanayotgan bo‘lsa, FormData kerak bo‘ladi
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

  if (data.pages && data.pages.length > 0) {
    formData.append(
      "pages",
      data.pages.map((item) => Number(item)) as unknown as string
    );
  }

  if (data.image instanceof File) formData.append("image", data.image);

  const response = await api.patch(`/menu/employees/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
