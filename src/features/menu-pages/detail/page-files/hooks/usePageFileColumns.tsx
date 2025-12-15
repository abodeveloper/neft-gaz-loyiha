import { Button } from "@/components/ui/button";
import { localized } from "@/i18n";
import { toastService } from "@/lib/toastService";
import ConfirmationDialog from "@/shared/components/atoms/confirmation-dialog/ConfirmationDialog";
import {
  RiDeleteBinLine,
  RiDownloadLine,
  RiEditLine,
  RiEyeLine,
  RiFileTextLine,
} from "@remixicon/react"; // Remix Icon
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
      id: "title",
      header: t("Title"),
      size: 500,
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
      id: "file",
      header: t("File"),
      cell: ({ row }) => {
        const item = row.original;
        const fileUrl = item.file as string;
        const fileName = fileUrl.split("/").pop()?.split("?")[0] || "file";

        return (
          <div className="flex items-center gap-3">
            <RiFileTextLine className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col gap-2">
              <span
                className="text-sm font-medium truncate max-w-[200px]"
                title={fileName}
              >
                {fileName}
              </span>

              <div className="flex gap-2">
                {/* View */}
                <Button variant="outline" size="sm" className="h-8">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2"
                  >
                    <RiEyeLine className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">{t("View")}</span>
                  </a>
                </Button>

                {/* Download */}
                <Button variant="default" size="sm" className="h-8">
                  <a
                    href={fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2"
                  >
                    <RiDownloadLine className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">
                      {t("Download")}
                    </span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "id",
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
