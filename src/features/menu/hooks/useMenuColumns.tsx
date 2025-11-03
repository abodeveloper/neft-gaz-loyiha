import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toastService } from "@/lib/toastService";
import ConfirmationDialog from "@/shared/components/atoms/confirmation-dialog/ConfirmationDialog";
import { RiDeleteBinLine, RiEditLine, RiEyeLine } from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { deleteMenu } from "../api/menu";
import { Menu } from "../types";

export function useMenuColumns(
  refetch: () => Promise<unknown> // ✅ to‘g‘ri tiplangan refetch
): ColumnDef<Menu>[] {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteMenu,
    onSuccess: async () => {
      await refetch?.(); // ✅ mavjud bo‘lsa chaqiradi
      toastService.success(t("Successfully deleted!"));
    },
    onError: (error: any) => {
      toastService.error(error.message || t("An error occurred"));
    },
  });

  const deleteItem = (id: number) => {
    deleteMutation(id);
  };

  return [
    {
      accessorKey: "title_uz",
      header: t("Title (uz)"),
      cell: ({ row }) => <div>{row.getValue("title_uz")}</div>,
    },
    {
      accessorKey: "title_ru",
      header: t("Title (ru)"),
      cell: ({ row }) => <div>{row.getValue("title_ru")}</div>,
    },
    {
      accessorKey: "title_en",
      header: t("Title (en)"),
      cell: ({ row }) => <div>{row.getValue("title_en")}</div>,
    },
    {
      accessorKey: "has_page",
      header: t("Type"),
      cell: ({ row }) =>
        row.getValue("has_page") ? (
          <Badge variant="outline">{t("Page")}</Badge>
        ) : (
          <Badge variant="default">{t("Section")}</Badge>
        ),
    },
    {
      accessorKey: "page_slug",
      header: t("Slug"),
      cell: ({ row }) =>
        row.getValue("has_page") && (
          <Badge variant="secondary">{row.getValue("page_slug")}</Badge>
        ),
    },
    {
      accessorKey: "position",
      header: t("Position"),
      cell: ({ row }) => (
        <Badge variant="default">{row.getValue("position")}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }) =>
        row.getValue("status") ? (
          <Badge variant="success">{t("Active")}</Badge>
        ) : (
          <Badge variant="destructive">{t("Inactive")}</Badge>
        ),
    },
    {
      accessorKey: "id",
      size: 140,
      header: t("Action"),
      cell: ({ row }) => {
        const hasPage = row.original.has_page;
        return (
          <div className="flex items-center gap-2 justify-end">
            {!hasPage && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(`/dashboard/menus/view/${row.getValue("id")}`)}
                title={t("View")}
                disabled={isDeleting}
                className="h-8 w-8"
              >
                <RiEyeLine className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`update/${row.getValue("id")}`)}
              title={t("Edit")}
              disabled={isDeleting}
              className="h-8 w-8"
            >
              <RiEditLine className="h-4 w-4" />
            </Button>

            <ConfirmationDialog
              trigger={
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  disabled={isDeleting}
                  title={t("Delete")}
                  className="h-8 w-8"
                >
                  <RiDeleteBinLine className="h-4 w-4" />
                </Button>
              }
              title={t("Delete Item")}
              description={t(
                "Are you sure you want to delete this menu item ?"
              )}
              onConfirm={() => deleteItem(row.getValue("id"))}
              confirmText={t("Yes, Delete")}
              cancelText={t("No, Cancel")}
              isLoading={isDeleting}
            />
          </div>
        );
      },
    },
  ];
}
