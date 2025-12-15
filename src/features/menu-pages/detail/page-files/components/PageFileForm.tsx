import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import BackButton from "@/shared/components/atoms/back-button/BackButton";
import {
  MyFileInput,
  MyInput,
  MySelect,
} from "@/shared/components/atoms/form-elements";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { usePageFileForm } from "../hooks/usePageFileForm";

interface FormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: any;
}

const PageFileForm = ({ mode, id, initialData }: FormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { form, onSubmit, mutation } = usePageFileForm({
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
          {mode === "create" ? t("Create page file") : t("Update page file")}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MySelect
              control={control}
              name="status"
              label={t("Status")}
              placeholder={t("Select status")}
              options={statusOptions}
              required
            />
            <MyInput
              control={control}
              name="position"
              type="number"
              min={1}
              label={t("Position")}
              placeholder={t("Position")}
              required
            />
          </div>

          <MyFileInput
            control={control}
            name="file"
            label={t("File")}
            multiple={false}
            accept=".pdf,.doc,.docx"
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

export default PageFileForm;
