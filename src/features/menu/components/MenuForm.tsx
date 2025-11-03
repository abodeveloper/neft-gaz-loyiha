import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { MyInput, MySelect } from "@/shared/components/atoms/form-elements";
import { useTranslation } from "react-i18next";
import { useMenuForm } from "../hooks/useMenuForm";

interface FormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: any;
  handleSuccess?: () => void;
}

const MenuForm = ({ mode, id, initialData, handleSuccess }: FormProps) => {
  const { t } = useTranslation();

  const { form, onSubmit, mutation } = useMenuForm({
    mode,
    id,
    initialData,
    t,
    handleSuccess,
  });

  const { control, handleSubmit } = form;

  const statusOptions = [
    { value: "true", label: t("Active") },
    { value: "false", label: t("Inactive") },
  ];

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {form.getValues("parent") && (
            <FormItem className="space-y-2">
              <FormLabel className="my-3">{t("Parent Menu")}</FormLabel>
              <FormDescription>{form.getValues("parent")}</FormDescription>
            </FormItem>
          )}

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
          <MyInput
            control={control}
            name="page_slug"
            label={t("Page slug")}
            placeholder={t("Page slug")}
            required
          />
          {/* Type + Status */}
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
              label={t("Position")}
              placeholder={t("Position")}
              required
            />
          </div>
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

export default MenuForm;
