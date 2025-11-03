export interface Carousel {
  id: number;
  title_uz?: string;
  title_ru?: string;
  title_en?: string;
  description_uz?: string;
  description_ru?: string;
  description_en?: string;
  position: number;
  link: string;
  status: boolean;
  image?: string | File | null;
}
