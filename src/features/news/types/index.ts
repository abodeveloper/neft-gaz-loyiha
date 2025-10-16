export enum NewsType {
  NEWS = "news",
  ANNOUNCEMENT = "announcement",
}

export interface News {
  id: number;
  title_uz: string;
  title_ru?: string;
  title_en?: string;
  description_uz?: string;
  description_ru?: string;
  description_en?: string;
  type: NewsType;
  status: boolean;
  image?: string | File | null;
}
