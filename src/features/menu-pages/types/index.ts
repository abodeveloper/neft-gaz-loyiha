import { Menu } from "@/features/menu/types";

export interface MenuPage {
  id: number;
  title_uz: string;
  title_ru: any;
  title_en: any;
  status: boolean;
  type: string;
  slug: string;
  menu: Menu;
}
