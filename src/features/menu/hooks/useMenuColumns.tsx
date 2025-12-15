import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { localized } from "@/i18n";
import { toastService } from "@/lib/toastService";
import ConfirmationDialog from "@/shared/components/atoms/confirmation-dialog/ConfirmationDialog";
import { RiDeleteBinLine, RiEditLine, RiEyeLine } from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { deleteMenu } from "../api/menu";
import { Menu } from "../types";

export function useMenuColumns(
  refetch: () => Promise<unknown>
): ColumnDef<Menu>[] {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<number | null>(null); // ✅ faqat shu id uchun

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: deleteMenu,
    onSuccess: async () => {
      await refetch?.();
      toastService.success(t("Successfully deleted!"));
    },
    onError: (error: any) => {
      toastService.error(error.message || t("An error occurred"));
    },
    onSettled: () => {
      setDeletingId(null); // ✅ har doim tozalaymiz
    },
  });

  const deleteItem = async (id: any) => {
    setDeletingId(id);
    await deleteMutation(id);
  };

  return [
    {
      id: "title",
      header: t("Title"),
      cell: ({ row }) => {
        const news = row.original;
        const title = localized(news, "title");

        return (
          <div
            className="font-medium"
            title={title || undefined}
          >
            {title || (
              <span className="text-muted-foreground">{t("No title")}</span>
            )}
          </div>
        );
      },
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
      header: t("Slug or children"),
      cell: ({ row }) =>
        row.getValue("has_page") ? (
          <Badge variant="secondary">{row.getValue("page_slug")}</Badge>
        ) : (
          <Badge variant="outline">
            {t("Children")}: {row.original.children?.length || 0}
          </Badge>
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
      header: t("Action"),
      cell: ({ row }) => {
        const id = row.getValue("id");
        const hasPage = row.original.has_page;
        const isDeleting = deletingId === id; // ✅ faqat shu satr uchun

        return (
          <div className="flex items-center gap-2 justify-end">
            {!hasPage && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(`/dashboard/menus/view/${id}`)}
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
              onClick={() => navigate(`/dashboard/menus/update/${id}`)}
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
              description={t("Are you sure you want to delete this item ?")}
              onConfirm={() => deleteItem(id)}
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
