import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MyTextarea, MyEditor } from "@/shared/components/atoms/form-elements";
import { useTranslation } from "react-i18next";
import { useMenuPageForm } from "../hooks/useMenuPageForm";

interface FormProps {
  id?: number;
  initialData?: any;
  handleSuccess?: () => void;
}

const MenuPageForm = ({ id, initialData, handleSuccess }: FormProps) => {
  const { t } = useTranslation();

  const { form, onSubmit, mutation } = useMenuPageForm({
    id,
    initialData,
    t,
    handleSuccess,
  });

  const { control, handleSubmit } = form;

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <Form {...form}>
        <h1 className="text-xl font-semibold">{t("Update menu page")}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <MyEditor
            control={control}
            name="description_uz"
            label={t("Description (uz)")}
            placeholder={t("Enter a description in Uzbek...")}
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

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
            loading={mutation.isPending}
          >
            {t("Update")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MenuPageForm;
