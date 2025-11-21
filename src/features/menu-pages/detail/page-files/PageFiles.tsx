import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { RiAddLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getPageFilesData } from "./api/page-file";
import { usePageFileColumns } from "./hooks/usePageFileColumns";

export default function PageFiles() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce<string>(searchInput, 300); // 300ms kechikish

  const { data, isLoading, isError } = useQuery({
    queryKey: ["page-files", debouncedSearch],
    queryFn: () => getPageFilesData(id, debouncedSearch),
  });

  const columns = usePageFileColumns();

  // Data

  const tableData = isEmpty(data) ? [] : data;

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
        <div className="text-xl font-semibold">{t("Page files")}</div>
        <div className="flex gap-2">
          <Input
            placeholder={t("Search ...")}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="max-w-sm w-64"
          />
          <Button
            variant="default"
            onClick={() => navigate(`files/create`)}
            title={t("Create")}
          >
            <RiAddLine className="h-5 w-5" /> {t("Create")}
          </Button>
        </div>
      </div>
      <div className="space-y-4">
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
