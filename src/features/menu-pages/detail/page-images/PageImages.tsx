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
import { getPageImagesData } from "./api/page-image";
import { usePageImageColumns } from "./hooks/usePageImageColumns";

export default function PageImages() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce<string>(searchInput, 300); // 300ms kechikish

  const { data, isLoading, isError } = useQuery({
    queryKey: ["page-images", debouncedSearch],
    queryFn: () => getPageImagesData(id, debouncedSearch),
  });

  const columns = usePageImageColumns();

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
        <div className="text-xl font-semibold">{t("Page images")}</div>
        <div className="flex gap-2">
          <Input
            placeholder={t("Search ...")}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="max-w-sm w-64"
          />
          <Button
            variant="default"
            onClick={() => navigate(`images/create`)}
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
