import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  MyFileInput,
  MyInput,
  MySelect,
  MyTextarea,
} from "@/shared/components/atoms/form-elements";
import { useTranslation } from "react-i18next";
import { useNewForm } from "../hooks/useNewForm";
import { NewsType } from "../types";
import BackButton from "@/shared/components/atoms/back-button/BackButton";

interface NewsFormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: any;
}

const NewsForm = ({ mode, id, initialData }: NewsFormProps) => {
  const { t } = useTranslation();

  const { form, onSubmit, mutation } = useNewForm({ mode, id, initialData, t });
  const { control, handleSubmit } = form;

  const typeOptions = [
    { value: NewsType.NEWS, label: t("News") },
    { value: NewsType.ANNOUNCEMENT, label: t("Announcement") },
  ];

  const statusOptions = [
    { value: "true", label: t("Active") },
    { value: "false", label: t("Inactive") },
  ];

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          {mode === "create" ? t("Create news") : t("Update news")}
        </h1>
        <BackButton />
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <MyInput
            control={control}
            name="title_uz"
            label={t("Title (uz)")}
            placeholder={t("Title (uz)")}
            required
          />

          <MyInput
            control={control}
            name="title_ru"
            label={t("Title (ru)")}
            placeholder={t("Title (ru)")}
            required
          />

          <MyInput
            control={control}
            name="title_en"
            label={t("Title (en)")}
            placeholder={t("Title (en)")}
            required
          />

          <MyTextarea
            control={control}
            name="description_uz"
            label={t("Description (uz)")}
            placeholder={t("Enter a description in Uzbek...")}
            rows={5}
            maxLength={1000}
            showCounter
            required
            helperText={t("Required field. Maximum 1000 characters.")}
          />

          <MyTextarea
            control={control}
            name="description_ru"
            label={t("Description (ru)")}
            placeholder={t("Enter a description in Russian...")}
            rows={5}
            maxLength={1000}
            showCounter
            required
            helperText={t("Required field. Maximum 1000 characters.")}
          />

          <MyTextarea
            control={control}
            name="description_en"
            label={t("Description (en)")}
            placeholder={t("Enter a description in English...")}
            rows={5}
            maxLength={1000}
            showCounter
            required
            helperText={t("Required field. Maximum 1000 characters.")}
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

          <MyFileInput
            control={control}
            name="image"
            label={t("Image")}
            accept="image/*"
            maxSize={5120}
            helperText={t("JPG, PNG, WEBP. Maksimal 5MB")}
            required={mode === "create"}
          />

          {/* Joriy rasm */}
          {initialData?.image &&
            typeof initialData.image === "string" &&
            !form.getValues().image && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">
                  {t("Current image")}:
                </p>
                <img
                  src={initialData.image}
                  alt={t("Current image")}
                  className="h-40 w-40 object-cover rounded-lg border"
                />
              </div>
            )}

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
            loading={mutation.isPending}
          >
            {mode === "create" ? t("Create") : t("Update")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewsForm;
