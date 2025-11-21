import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import BackButton from "@/shared/components/atoms/back-button/BackButton";
import { MyFileInput } from "@/shared/components/atoms/form-elements";
import { useTranslation } from "react-i18next";
import { usePageImageForm } from "../hooks/usepageImageForm";

interface FormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: any;
}

const PageImageForm = ({ mode, id, initialData }: FormProps) => {
  const { t } = useTranslation();

  const { form, onSubmit, mutation } = usePageImageForm({
    mode,
    id,
    initialData,
    t,
  });

  const { control, handleSubmit } = form;

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          {mode === "create" ? t("Create page image") : t("Update page image")}
        </h1>
        <BackButton />
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

export default PageImageForm;
