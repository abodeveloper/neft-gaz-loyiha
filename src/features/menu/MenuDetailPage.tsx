import { DataTable } from "@/components/ui/data-table";
import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import { useQuery } from "@tanstack/react-query";
import { get, isEmpty } from "lodash";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getMenuById } from "./api/menu";
import CreateMenuModal from "./components/CreateMenuModal";
import { useMenuColumns } from "./hooks/useMenuColumns";
import BackButton from "@/shared/components/atoms/back-button/BackButton";

export default function MenusPage() {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();

  const itemId = parseInt(id || "0", 10);

  const {
    data: item,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["menu", itemId],
    queryFn: () => getMenuById(itemId),
    enabled: !!itemId && itemId > 0,
  });

  const columns = useMenuColumns(refetch);

  // Data va pagination ma'lumotlari
  const tableData = isEmpty(item?.children) ? [] : item?.children;

  if (isError)
    return (
      <ErrorMessage
        title={t("Failed to load page")}
        message={t("An error occurred. Please try again later.")}
      />
    );

  const handleSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xl font-semibold">{t('Menu')}: {get(item, "title_uz")}</div>
        <div className="flex gap-2">
          <CreateMenuModal parentId={itemId} onSuccess={handleSuccess} />
          <BackButton />
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
