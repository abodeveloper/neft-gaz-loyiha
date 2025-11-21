export interface PageFile {
  id: number;
  page: number;
  title_uz?: string;
  title_ru?: string;
  title_en?: string;
  position: number;
  status: boolean;
  file?: string | File | null;
}
