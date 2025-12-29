import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { RiAddLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getCarouselsData } from "./api/carousels";
import { useCarouselColumns } from "./hooks/useCarouselColumns";

interface FilterForm {
  status: boolean;
}

const DEFAULT_VALUES: FilterForm = {
  status: true,
};

export default function CarouselsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [filterQuery, setFilterQuery] = useState<FilterForm>(
      DEFAULT_VALUES
    );
  const debouncedSearch = useDebounce<string>(searchInput, 300); // 300ms kechikish

  const { control, handleSubmit, reset } = useForm<FilterForm>({
    defaultValues: DEFAULT_VALUES,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["carousels", debouncedSearch, filterQuery],
    queryFn: () => getCarouselsData(debouncedSearch, filterQuery),
  });

  const columns = useCarouselColumns();

  const tableData = isEmpty(data) ? [] : data;

  if (isError)
    return (
      <ErrorMessage
        title={t("Failed to load page")}
        message={t("An error occurred. Please try again later.")}
      />
    );

  const onSubmit = (data: FilterForm) => {
    setFilterQuery(data);
  };

  // To‘g‘rilangan reset funksiyasi
  const handleReset = () => {
    reset(DEFAULT_VALUES); // Formani vizual holatini tiklash
    setFilterQuery(DEFAULT_VALUES); // So'rovni boshlang'ich holatga qaytarish
    setSearchInput("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xl font-semibold">{t("Carousels")}</div>
        <div className="flex gap-2">
          <Input
            placeholder={t("Search ...")}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="max-w-sm w-64"
          />
          <Button
            variant="default"
            onClick={() => navigate(`create`)}
            title={t("Create")}
          >
            <RiAddLine className="h-5 w-5" /> {t("Create")}
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value === "true")} // Stringni booleanga aylantirish
                  value={field.value ? "true" : "false"} // Booleanni stringga aylantirish
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Filter by status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">{t("Active")}</SelectItem>
                    <SelectItem value="false">{t("Inactive")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit">{t("Filter")}</Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                {t("Reset")}
              </Button>
            </div>
          </div>
        </form>
        <DataTable
          data={tableData}
          columns={columns}
          pagination={false}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
