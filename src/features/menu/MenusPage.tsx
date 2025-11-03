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
import { buildFilterQuery } from "@/shared/utils/helper";
import { RiAddLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getMenusData } from "./api/menu";
import CreateMenuModal from "./components/CreateMenuModal";
import { useMenuColumns } from "./hooks/useMenuColumns";

interface FilterForm {
  status: boolean;
}

export default function MenusPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const debouncedSearch = useDebounce<string>(searchInput, 300); // 300ms kechikish

  const { control, handleSubmit, reset } = useForm<FilterForm>({
    defaultValues: {
      status: true, // Boolean sifatida boshlang‘ich qiymat
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["menus", debouncedSearch, filterQuery],
    queryFn: () => getMenusData(debouncedSearch, filterQuery),
  });

  const columns = useMenuColumns();

  // Data va pagination ma'lumotlari
  const tableData = isEmpty(data) ? [] : data;

  if (isError)
    return (
      <ErrorMessage
        title={t("Failed to load page")}
        message={t("An error occurred. Please try again later.")}
      />
    );

  const onSubmit = (data: FilterForm) => {
    setFilterQuery(buildFilterQuery(data));
  };

  // To‘g‘rilangan reset funksiyasi
  const handleReset = () => {
    reset({
      status: true, // Boolean sifatida boshlang‘ich qiymat
    });
    setFilterQuery(""); // Filter queryni tozalash
    setSearchInput(""); // Qidiruv maydonini tozalash
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xl font-semibold">{t("Menus")}</div>
        <div className="flex gap-2">
          <Input
            placeholder={t("Search ...")}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="max-w-sm w-64"
          />
          {/* <Button
            variant="default"
            onClick={() => navigate(`create`)}
            title={t("Create")}
          >
            <RiAddLine className="h-5 w-5" /> {t("Create")}
          </Button> */}
          <CreateMenuModal />
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
