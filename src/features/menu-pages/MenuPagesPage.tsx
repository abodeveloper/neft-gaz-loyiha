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
import { useQuery } from "@tanstack/react-query";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getMenuPagesData } from "./api/menu-page";
import { useMenuColumns } from "./hooks/useMenuPageColumns";

interface FilterForm {
  status: boolean;
}

const DEFAULT_VALUES: FilterForm = {
  status: true,
};

export default function MenuPagesPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [filterQuery, setFilterQuery] = useState<FilterForm>(
      DEFAULT_VALUES
    );
  const debouncedSearch = useDebounce<string>(searchInput, 300); // 300ms kechikish

  const { control, handleSubmit, reset } = useForm<FilterForm>({
      defaultValues: DEFAULT_VALUES, // 3. Formaga ham o'sha qiymatni beramiz
    });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["menu-pages", page, debouncedSearch, filterQuery],
    queryFn: () => getMenuPagesData(page, debouncedSearch, filterQuery),
  });

  const columns = useMenuColumns();

  // Data va pagination ma'lumotlari
  const tableData = get(data, "results", []);
  const paginationInfo = {
    totalCount: get(data, "count", 0),
    totalPages: get(data, "total_pages", 1),
    currentPage: page,
  };

  // Qidiruv yoki filter o‘zgarganda sahifani 1 ga qaytarish
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterQuery]);

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
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xl font-semibold">{t("Pages")}</div>
        <div className="flex gap-2">
          <Input
            placeholder={t("Search ...")}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="max-w-sm w-64"
          />
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
          pagination={true}
          totalCount={paginationInfo.totalCount}
          totalPages={paginationInfo.totalPages}
          currentPage={paginationInfo.currentPage}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
