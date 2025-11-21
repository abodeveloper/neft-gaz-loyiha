import { Button } from "@/components/ui/button";
import { toastService } from "@/lib/toastService";
import ConfirmationDialog from "@/shared/components/atoms/confirmation-dialog/ConfirmationDialog";
import { RiDeleteBinLine, RiDownloadLine, RiEditLine } from "@remixicon/react"; // Remix Icon
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { deletePageFile } from "../api/page-file";
import { PageFile } from "../types";

export function usePageFileColumns(): ColumnDef<PageFile>[] {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Delete mutation
  const { mutate: deleteItemMutation, isPending: isDeleting } = useMutation({
    mutationFn: deletePageFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-files"] });
      toastService.success(t("Succesfully deleted !"));
    },
    onError: (error) => {
      toastService.error(error.message);
    },
  });

  const deleteItem = (id: number) => {
    deleteItemMutation(id);
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
      accessorKey: "file",
      header: t("File"),
      cell: ({ row }) => {
        const file = row.getValue("file") as string;
        return (
          <div>
            <a href={file} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="flex items-center gap-2">
                <>
                  <RiDownloadLine className="w-4 h-4" />
                  {t("Download")}
                </>
              </Button>
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      size: 100,
      header: t("Action"),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`files/update/${row.getValue("id")}`)}
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
            description={t("Are you sure you want to delete this news item ?")}
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
