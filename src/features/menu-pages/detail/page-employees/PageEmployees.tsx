import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { getEmployeesDataByPage } from "@/features/employees/api/employees";
import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useEmployeeColumns } from "./hooks/useEmployeeColumns";

export default function PageEmployees() {
  const { t } = useTranslation();
  const { id: pageId } = useParams();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce<string>(searchInput, 300); // 300ms kechikish

  const { data, isLoading, isError } = useQuery({
    queryKey: ["page-employees", page, debouncedSearch],
    queryFn: () => getEmployeesDataByPage(page, pageId, debouncedSearch),
  });

  const columns = useEmployeeColumns();

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
  }, [debouncedSearch]);

  if (isError)
    return (
      <ErrorMessage
        title={t("Failed to load page")}
        message={t("An error occurred. Please try again later.")}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xl font-semibold">{t("Employees")}</div>
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
