import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getAllMenuPages } from "@/features/menu-pages/api/menu-page";
import { localized } from "@/i18n";
import BackButton from "@/shared/components/atoms/back-button/BackButton";
import {
  MyDateTimePicker,
  MyEditor,
  MyFileInput,
  MyInput,
  MySelect
} from "@/shared/components/atoms/form-elements";
import { useData } from "@/shared/hooks/useData";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useNewForm } from "../hooks/useNewForm";
import { NewsType } from "../types";

interface NewsFormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: any;
}

const NewsForm = ({ mode, id, initialData }: NewsFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { form, onSubmit, mutation } = useNewForm({ mode, id, initialData, t });
  const { control, handleSubmit } = form;

  const typeOptions = [
    { value: NewsType.NEWS, label: t("News") },
    { value: NewsType.ANNOUNCEMENT, label: t("Announcement") },
  ];

  const statusOptions = [
    { value: true, label: t("Active") },
    { value: false, label: t("Inactive") },
  ];

  const { data: pagesData } = useData({
      fetchFn: getAllMenuPages,
      labelKey: "title_uz",
      valueKey: "id",
      queryKey: ["pages", "all"],
    });
  
    const PAGE_OPTIONS = pagesData?.map((page: any) => {
      return { label: localized(page, "title"), value: page.id };
    });

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          {mode === "create" ? t("Create news") : t("Update news")}
        </h1>
        <BackButton />
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <MySelect
            control={control}
            name="pages"
            label={t("Pages")}
            placeholder={t("Select pages")}
            options={PAGE_OPTIONS}
            multiple={true}
            searchable={true}
            required
          />

          <MyInput
            control={control}
            name="title_uz"
            label={t("Title (uz)")}
            disabled={mutation.isPending}
            required
          />

          <MyEditor
            control={control}
            name="description_uz"
            label={t("Description (uz)")}
            placeholder={t("Enter a description in Uzbek...")}
            disabled={mutation.isPending}
            height={700}
            required
          />

          <MyInput
            control={control}
            name="title_ru"
            label={t("Title (ru)")}
            disabled={mutation.isPending}
            required
          />

          <MyEditor
            control={control}
            name="description_ru"
            label={t("Description (ru)")}
            placeholder={t("Enter a description in Russian...")}
            height={700}
            required
          />

          <MyInput
            control={control}
            name="title_en"
            label={t("Title (en)")}
            disabled={mutation.isPending}
            required
          />

          <MyEditor
            control={control}
            name="description_en"
            label={t("Description (en)")}
            placeholder={t("Enter a description in English...")}
            disabled={mutation.isPending}
            height={700}
            required
          />

          {/* Type + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MySelect
              control={control}
              name="type"
              label={t("Type")}
              placeholder={t("Select type")}
              options={typeOptions}
              required
            />
            <MySelect
              control={control}
              name="status"
              label={t("Status")}
              placeholder={t("Select status")}
              options={statusOptions}
              required
            />
          </div>

          <MyDateTimePicker
            control={control}
            name="published_date"
            label={t("Published Date")}
            required
          />

          <MyFileInput
            control={control}
            name="images"
            label={t("Images")}
            accept="image/*"
            maxSize={5120}
            helperText={t("JPG, PNG, WEBP. Maksimal 5MB")}
            required={mode === "create"}
            multiple={true}
          />

          <div className="flex justify-end gap-3">
            <Button
              variant={"outline"}
              type="button"
              className="w-44"
              disabled={mutation.isPending}
              onClick={() => navigate(-1)}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              className="w-44"
              disabled={mutation.isPending}
              loading={mutation.isPending}
            >
              {mode === "create" ? t("Create") : t("Update")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewsForm;
