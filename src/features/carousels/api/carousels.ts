import api from "@/lib/axios";
import { CarouselDto } from "../schemas/createCarouselSchema";

export const getCarouselsData = async (search: string, filterQuery?: string) => {
  let url = `/parts/carousels/`;

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

export const getCarouselById = async (id: string | number | undefined) => {
  const response = await api.get(`/parts/carousels/${id}/`);
  return response.data;
};

export const deleteCarousel = async (id: number) => {
  const response = await api.delete(`/parts/carousels/${id}/`);
  return response.data;
};

export const createCarousel = async (data: CarouselDto) => {
  const formData = new FormData();
  formData.append("title_uz", data.title_uz);
  if (data.title_ru) formData.append("title_ru", data.title_ru);
  if (data.title_en) formData.append("title_en", data.title_en);
  if (data.description_uz)
    formData.append("description_uz", data.description_uz);
  if (data.description_ru)
    formData.append("description_ru", data.description_ru);
  if (data.description_en)
    formData.append("description_en", data.description_en);
  if (data.link) formData.append("link", data.link);
  if (data.position) formData.append("position", data.position);
  formData.append("status", data.status.toString());
  if (data.image instanceof File) {
    formData.append("image", data.image);
  }

  const response = await api.post("/parts/carousels/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateCarousel = async (
  id: number,
  data: Partial<CarouselDto>
) => {
  // Agar rasm File bo‘lmasa (ya’ni allaqachon mavjud bo‘lsa yoki string bo‘lsa)
  // u holda JSON orqali yuboramiz
  if (!(data.image instanceof File)) {
    const payload = {
      title_uz: data.title_uz,
      title_ru: data.title_ru,
      title_en: data.title_en,
      description_uz: data.description_uz,
      description_ru: data.description_ru,
      description_en: data.description_en,
      link: data.link,
      position: data.position,
      status: data.status,
      image: data.image, // string URL bo‘lishi mumkin
    };

    // undefined va null qiymatlarni olib tashlaymiz
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
    );

    const response = await api.patch(
      `/parts/carousels/${id}/`,
      filteredPayload
    );
    return response.data;
  }

  // Agar yangi rasm yuklanayotgan bo‘lsa, FormData kerak bo‘ladi
  const formData = new FormData();
  if (data.title_uz) formData.append("title_uz", data.title_uz);
  if (data.title_ru) formData.append("title_ru", data.title_ru);
  if (data.title_en) formData.append("title_en", data.title_en);
  if (data.description_uz)
    formData.append("description_uz", data.description_uz);
  if (data.description_ru)
    formData.append("description_ru", data.description_ru);
  if (data.description_en)
    formData.append("description_en", data.description_en);
  if (data.link) formData.append("link", data.link);
  if (data.position) formData.append("position", data.position);
  if (data.status !== undefined)
    formData.append("status", data.status.toString());
  if (data.image instanceof File) formData.append("image", data.image);

  const response = await api.patch(`/parts/carousels/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
