import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getAllMenuPages } from "@/features/menu-pages/api/menu-page";
import BackButton from "@/shared/components/atoms/back-button/BackButton";
import {
  MyFileInput,
  MyInput,
  MySelect,
  MyTextarea,
} from "@/shared/components/atoms/form-elements";
import { useData } from "@/shared/hooks/useData";
import { useTranslation } from "react-i18next";
import { useEmployeeForm } from "../hooks/useEmployeeForm";

interface FormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: any;
}

const EmployeeForm = ({ mode, id, initialData }: FormProps) => {
  const { t } = useTranslation();

  const { form, onSubmit, mutation } = useEmployeeForm({
    mode,
    id,
    initialData,
    t,
  });

  const { control, handleSubmit } = form;

  const {
    options: pageOptions = [], // DEFAULT []
  } = useData({
    fetchFn: getAllMenuPages,
    labelKey: "title_uz",
    valueKey: "id",
    queryKey: ["pages", "all"],
  });

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
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
            options={pageOptions}
            multiple={true}
            searchable={true}
            required
          />

          <MyInput
            control={control}
            name="full_name_uz"
            label={t("Full name (uz)")}
            placeholder={t("Full name (uz)")}
            required
          />

          <MyInput
            control={control}
            name="full_name_ru"
            label={t("Full name (ru)")}
            placeholder={t("Full name (ru)")}
            required
          />

          <MyInput
            control={control}
            name="full_name_en"
            label={t("Full name (en)")}
            placeholder={t("Full name (en)")}
            required
          />

          <MyInput
            control={control}
            name="position_uz"
            label={t("Position (uz)")}
            placeholder={t("Position (uz)")}
            required
          />

          <MyInput
            control={control}
            name="position_ru"
            label={t("Position (ru)")}
            placeholder={t("Position (ru)")}
            required
          />

          <MyInput
            control={control}
            name="position_en"
            label={t("Position (en)")}
            placeholder={t("Position (en)")}
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
            <MyInput
              control={control}
              type="email"
              name="email"
              label={t("Email")}
              placeholder={t("Email")}
              required
            />
            <MyInput
              control={control}
              type="phone"
              name="phone"
              label={t("Phone")}
              placeholder={t("Phone")}
              required
            />
          </div>

          <MyInput
            control={control}
            name="order"
            type="number"
            label={t("Order")}
            placeholder={t("Order")}
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

export default EmployeeForm;
