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
import { get } from "lodash";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getEducationsData } from "./api/education";
import { useEducationColumns } from "./hooks/useEducationColumns";

interface FilterForm {
  status: boolean;
}

// 1. Default qiymatlarni tashqariga yoki component ichida alohida obyektga olamiz
const DEFAULT_VALUES: FilterForm = {
  status: true,
};

export default function PostgraduateEducationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  // 2. filterQuery ni boshlang'ich qiymatini DEFAULT_VALUES bilan bir xil qilamiz
  const [filterQuery, setFilterQuery] = useState<FilterForm>(DEFAULT_VALUES);

  const debouncedSearch = useDebounce<string>(searchInput, 300);

  const { control, handleSubmit, reset } = useForm<FilterForm>({
    defaultValues: DEFAULT_VALUES, // 3. Formaga ham o'sha qiymatni beramiz
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["postgraduate-educations", page, debouncedSearch, filterQuery],
    queryFn: () => getEducationsData(page, debouncedSearch, filterQuery),
  });

  const columns = useEducationColumns();

  const tableData = get(data, "results", []);
  const paginationInfo = {
    totalCount: get(data, "count", 0),
    totalPages: get(data, "total_pages", 1),
    currentPage: page,
  };

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

  // 4. Reset funksiyasini to'g'irlaymiz: u bo'sh satr emas, balki default qiymatga qaytishi kerak
  const handleReset = () => {
    reset(DEFAULT_VALUES); // Formani vizual holatini tiklash
    setFilterQuery(DEFAULT_VALUES); // So'rovni boshlang'ich holatga qaytarish
    setSearchInput("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xl font-semibold">
          {t("Postgraduate educations")}
        </div>
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
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value ? "true" : "false"}
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
