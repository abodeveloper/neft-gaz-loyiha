import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import BackButton from "@/shared/components/atoms/back-button/BackButton";
import {
  MyFileInput,
  MyInput,
  MyTextarea
} from "@/shared/components/atoms/form-elements";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCompanyForm } from "../hooks/useCompanyForm";

interface FormProps {
  initialData?: any;
}

const CompanyForm = ({ initialData }: FormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { form, onSubmit, mutation } = useCompanyForm({ initialData, t });
  const { control, handleSubmit } = form;

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          {t("Update company information")}
        </h1>
        <BackButton />
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <MyInput
            control={control}
            name="name_uz"
            label={t("Name (uz)")}
            required
          />

          <MyInput
            control={control}
            name="name_ru"
            label={t("Name (ru)")}
            required
          />

          <MyInput
            control={control}
            name="name_en"
            label={t("Name (en)")}
            required
          />

          <MyTextarea
            control={control}
            name="address_uz"
            label={t("Address (uz)")}
            placeholder={t("Enter an address in Uzbek...")}
            rows={4}
            required
          />

          <MyTextarea
            control={control}
            name="address_ru"
            label={t("Address (ru)")}
            placeholder={t("Enter an address in Russian...")}
            rows={4}
            required
          />

          <MyTextarea
            control={control}
            name="address_en"
            label={t("Address (en)")}
            placeholder={t("Enter an address in English...")}
            rows={4}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MyInput
              control={control}
              name="stat_1"
              label={t("Statistic 1")}
              required
            />
            <MyInput
              control={control}
              name="stat_2"
              label={t("Statistic 2")}
              required
            />
            <MyInput
              control={control}
              name="stat_3"
              label={t("Statistic 3")}
              required
            />
            <MyInput
              control={control}
              name="stat_4"
              label={t("Statistic 4")}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MyInput
              control={control}
              name="phone_number"
              label={t("Phone Number")}
              required
            />
            <MyInput
              control={control}
              name="email"
              label={t("Email")}
              type="email"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MyInput
              control={control}
              name="instagram"
              label={t("Instagram")}
            />
            <MyInput control={control} name="telegram" label={t("Telegram")} />
            <MyInput control={control} name="facebook" label={t("Facebook")} />
            <MyInput control={control} name="youtube" label={t("YouTube")} />
            <MyInput control={control} name="linkedin" label={t("LinkedIn")} />
          </div>

          <MyFileInput
            control={control}
            name="logo"
            label={t("Company Logo")}
            accept="image/*"
            maxSize={5120}
            helperText={t("JPG, PNG, WEBP. Maksimal 5MB")}
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
              {t("Update")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompanyForm;
