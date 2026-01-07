import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getAllMenuPages } from "@/features/menu-pages/api/menu-page";
import { localized } from "@/i18n";
import BackButton from "@/shared/components/atoms/back-button/BackButton";
import {
  MyEditor,
  MyFileInput,
  MyInput,
  MySelect
} from "@/shared/components/atoms/form-elements";
import { useData } from "@/shared/hooks/useData";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEmployeeForm } from "../hooks/useEmployeeForm";

interface FormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: any;
}

const EmployeeForm = ({ mode, id, initialData }: FormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { form, onSubmit, mutation } = useEmployeeForm({
    mode,
    id,
    initialData,
    t,
  });

  const { control, handleSubmit } = form;

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
          {mode === "create" ? t("Create employee") : t("Update employee")}
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
            name="full_name_uz"
            label={t("Full name (uz)")}
            required
          />

          <MyInput
            control={control}
            name="full_name_ru"
            label={t("Full name (ru)")}
            required
          />

          <MyInput
            control={control}
            name="full_name_en"
            label={t("Full name (en)")}
            required
          />

          <MyInput
            control={control}
            name="position_uz"
            label={t("Position (uz)")}
            required
          />

          <MyInput
            control={control}
            name="position_ru"
            label={t("Position (ru)")}
            required
          />

          <MyInput
            control={control}
            name="position_en"
            label={t("Position (en)")}
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

          <MyEditor
            control={control}
            name="description_ru"
            label={t("Description (ru)")}
            placeholder={t("Enter a description in Russian...")}
            disabled={mutation.isPending}
            height={700}
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
            <MyInput
              control={control}
              type="email"
              name="email"
              label={t("Email")}
            />
            <MyInput
              control={control}
              type="phone"
              name="phone"
              label={t("Phone")}
            />
          </div>

          <MyInput
            control={control}
            name="order"
            min={1}
            type="number"
            label={t("Order")}
            required
          />

          <MyFileInput
            control={control}
            name="image"
            label={t("Image")}
            accept="image/*"
            maxSize={5120}
            helperText={t("JPG, PNG, WEBP. Maksimal 5MB")}
            required={mode === "create"}
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

export default EmployeeForm;
