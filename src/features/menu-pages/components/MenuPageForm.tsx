import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MyEditor, MyInput } from "@/shared/components/atoms/form-elements";
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
    <div className="space-y-6 w-full mx-auto">
      <Form {...form}>
        {/* <h1 className="text-xl font-semibold">{t("Update menu page")}</h1> */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <MyInput
            control={control}
            name="title_uz"
            label={t("Title (uz)")}
            placeholder={t("Title (uz)")}
            disabled={mutation.isPending}
            required
          />
          <MyEditor
            control={control}
            name="description_uz"
            label={t("Description (uz)")}
            placeholder={t("Enter a description in Uzbek...")}
            disabled={mutation.isPending}
            required
          />

          <MyInput
            control={control}
            name="title_ru"
            label={t("Title (ru)")}
            placeholder={t("Title (ru)")}
            disabled={mutation.isPending}
            required
          />

          <MyEditor
            control={control}
            name="description_ru"
            label={t("Description (ru)")}
            placeholder={t("Enter a description in Russian...")}
            required
          />

          <MyInput
            control={control}
            name="title_en"
            label={t("Title (en)")}
            placeholder={t("Title (en)")}
            disabled={mutation.isPending}
            required
          />

          <MyEditor
            control={control}
            name="description_en"
            label={t("Description (en)")}
            placeholder={t("Enter a description in English...")}
            disabled={mutation.isPending}
            required
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
