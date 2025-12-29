import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { localized } from "@/i18n";
import { toastService } from "@/lib/toastService";
import ConfirmationDialog from "@/shared/components/atoms/confirmation-dialog/ConfirmationDialog";
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react"; // Remix Icon
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { deleteDepartment } from "../api/department";
import { Department } from "../types";

export function useDepartmentColumns(): ColumnDef<Department>[] {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Delete mutation
  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toastService.success(t("Succesfully deleted !"));
    },
    onError: (error) => {
      toastService.error(error.message);
    },
  });

  const deleteItem = (id: number) => {
    deleteMutation(id);
  };

  return [
    {
      id: "title",
      header: t("Title"),
      size: 300,
      cell: ({ row }) => {
        const news = row.original;
        const title = localized(news, "title");

        return (
          <div className="font-medium" title={title || undefined}>
            {title || (
              <span className="text-muted-foreground">{t("No title")}</span>
            )}
          </div>
        );
      },
    },
    {
      id: "sub_title",
      header: t("Sub title"),
      size: 300,
      cell: ({ row }) => {
        const item = row.original;
        const sub_title = localized(item, "sub_title");

        return (
          <div className="font-medium" title={sub_title || undefined}>
            {sub_title || (
              <span className="text-muted-foreground">{t("No sub title")}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "slug",
      header: t("Slug"),
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("slug")}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }) => (
        <div>
          {row.getValue("status") ? (
            <Badge variant="success">{t("Active")}</Badge>
          ) : (
            <Badge variant="destructive">{t("Inactive")}</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "position",
      header: t("Order"),
      cell: ({ row }) => (
        <Badge variant="default">{row.getValue("position")}</Badge>
      ),
    },
    {
      accessorKey: "id",
      header: t("Action"),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`update/${row.getValue("id")}`)}
            title={t("Edit")}
            disabled={isDeleting}
          >
            <RiEditLine className="h-4 w-4" />
          </Button>
          <ConfirmationDialog
            trigger={
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isDeleting}
                title={t("Delete")}
              >
                <RiDeleteBinLine className="h-4 w-4" />
              </Button>
            }
            title={t("Delete Item")}
            description={t("Are you sure you want to delete this item ?")}
            onConfirm={() => deleteItem(row.getValue("id"))}
            confirmText={t("Yes, Delete")}
            cancelText={t("No, Cancel")}
            isLoading={isDeleting}
          />
        </div>
      ),
    },
  ];
}
