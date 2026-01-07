import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import BackButton from "@/shared/components/atoms/back-button/BackButton";
import {
  MyEditor,
  MyInput,
  MySelect,
  MyTextarea
} from "@/shared/components/atoms/form-elements";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEducationForm } from "../hooks/useEducationForm";

import ExampleImage from "@/assets/example-logo-select.png";

interface FormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: any;
}

const EducationForm = ({ mode, id, initialData }: FormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { form, onSubmit, mutation } = useEducationForm({
    mode,
    id,
    initialData,
    t,
  });

  const { control, handleSubmit } = form;

  const statusOptions = [
    { value: true, label: t("Active") },
    { value: false, label: t("Inactive") },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          {mode === "create"
            ? t("Create postgraduate education")
            : t("Update postgraduate education")}
        </h1>
        <BackButton />
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <MyInput
            control={control}
            name="title_uz"
            label={t("Title (uz)")}
            disabled={mutation.isPending}
            required
          />
          <MyTextarea
            control={control}
            name="sub_title_uz"
            label={t("Sub title (uz)")}
            rows={5}
            required
          />

          <MyInput
            control={control}
            name="direction_uz"
            label={t("Direction (uz)")}
            required
          />

          <MyInput
            control={control}
            name="duration_uz"
            label={t("Duration (uz)")}
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

          <MyTextarea
            control={control}
            name="sub_title_ru"
            label={t("Sub title (ru)")}
            rows={5}
            required
          />

          <MyInput
            control={control}
            name="direction_ru"
            label={t("Direction (ru)")}
            required
          />

          <MyInput
            control={control}
            name="duration_ru"
            label={t("Duration (ru)")}
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

          <MyTextarea
            control={control}
            name="sub_title_en"
            label={t("Sub title (en)")}
            rows={5}
            required
          />

          <MyInput
            control={control}
            name="direction_en"
            label={t("Direction (en)")}
            required
          />

          <MyInput
            control={control}
            name="duration_en"
            label={t("Duration (en)")}
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

          <MyInput
            control={control}
            name="logo"
            label={
              <>
                {t("Logo name")} (
                <a href={"https://lucide.dev/icons"} target="_blank">
                  https://lucide.dev/icons
                </a>
                )
              </>
            }
            placeholder={t("Example: graduation-cap")}
            required
          />

          <img src={ExampleImage} alt="" className="w-full" />

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

export default EducationForm;
