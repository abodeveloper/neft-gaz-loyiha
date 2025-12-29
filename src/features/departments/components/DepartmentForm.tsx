import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import BackButton from "@/shared/components/atoms/back-button/BackButton";
import {
  MyInput,
  MySelect,
  MyTextarea
} from "@/shared/components/atoms/form-elements";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDepartmentForm } from "../hooks/useDepartmentForm";

interface FormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: any;
}

const DepartmentForm = ({ mode, id, initialData }: FormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { form, onSubmit, mutation } = useDepartmentForm({ mode, id, initialData, t });
  const { control, handleSubmit } = form;

  const statusOptions = [
    { value: true, label: t("Active") },
    { value: false, label: t("Inactive") },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          {mode === "create" ? t("Create department") : t("Update department")}
        </h1>
        <BackButton />
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <MyInput
            control={control}
            name="title_uz"
            label={t("Title (uz)")}
            required
          />

          <MyInput
            control={control}
            name="title_ru"
            label={t("Title (ru)")}
            required
          />

          <MyInput
            control={control}
            name="title_en"
            label={t("Title (en)")}
            required
          />

          <MyTextarea
            control={control}
            name="description_uz"
            label={t("Description (uz)")}
            placeholder={t("Enter a description in Uzbek...")}
            rows={10}
            required
          />

          <MyTextarea
            control={control}
            name="description_ru"
            label={t("Description (ru)")}
            placeholder={t("Enter a description in Russian...")}
            rows={10}
            required
          />

          <MyTextarea
            control={control}
            name="description_en"
            label={t("Description (en)")}
            placeholder={t("Enter a description in English...")}
            rows={10}
            required
          />

          <MyInput control={control} name="sub_title" label={t("Sub title")} required />
          <MyInput control={control} name="slug" label={t("Slug")} required />

          {/* Type + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MyInput
              control={control}
              name="position"
              type="number"
              min={1}
              label={t("Order")}
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

export default DepartmentForm;
