import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import BackButton from "@/shared/components/atoms/back-button/BackButton";
import { MyInput, MySelect } from "@/shared/components/atoms/form-elements";
import { useData } from "@/shared/hooks/useData";
import { useTranslation } from "react-i18next";
import { getAllMenus } from "../api/menu";
import { useMenuForm } from "../hooks/useMenuForm";

interface FormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: any;
  handleSuccess?: () => void;
  parentId?: any;
}

const MenuForm = ({
  mode,
  id,
  initialData,
  handleSuccess,
  parentId,
}: FormProps) => {
  const { t } = useTranslation();

  const { form, onSubmit, mutation } = useMenuForm({
    mode,
    id,
    initialData,
    t,
    handleSuccess,
  });

  const { control, handleSubmit, watch } = form;

  const statusOptions = [
    { value: "true", label: t("Active") },
    { value: "false", label: t("Inactive") },
  ];

  const {
    options: menuOptions = [], // DEFAULT []
  } = useData({
    fetchFn: getAllMenus,
    labelKey: "title_en",
    valueKey: "id",
    queryKey: ["menus", "all"],
  });

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <Form {...form}>
        {mode === "update" && (
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">{t("Update menu")}</h1>
            <BackButton />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Parent Menu */}
          {parentId && (
            <MySelect
              control={control}
              name="parent"
              label={t("Parent menu")}
              placeholder={t("Select parent menu")}
              options={menuOptions}
              disabled={true}
            />
          )}

          {/* Titles */}
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

          <MySelect
            control={control}
            name="has_page"
            label={t("Type")}
            placeholder={t("Select type")}
            options={[
              {
                label: t("Page"),
                value: true,
              },
              {
                label: t("Section"),
                value: false,
              },
            ]}
            required
          />

          {/* Has Page */}
          {/* <MyCheckbox control={control} name="has_page" label={t("Has page")} /> */}
          {watch("has_page") && (
            <MyInput
              control={control}
              name="page_slug"
              label={t("Page slug")}
              placeholder={t("Page slug")}
              required
            />
          )}

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
