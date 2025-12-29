import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toastService } from "@/lib/toastService";
import ConfirmationDialog from "@/shared/components/atoms/confirmation-dialog/ConfirmationDialog";
import { RiDeleteBinLine } from "@remixicon/react"; // Remix Icon
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { deleteApplication } from "../api/application";
import { Application } from "../types";

export function useApplicationColumns(): ColumnDef<Application>[] {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Delete mutation
  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
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
      accessorKey: "name",
      header: t("Name"),
      cell: ({ row }) => <>{row.getValue("name")}</>,
    },
    {
      accessorKey: "phone",
      header: t("Phone"),
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("phone")}</Badge>
      ),
    },
    {
      accessorKey: "message",
      header: t("Message"),
      cell: ({ row }) => <>{row.getValue("message")}</>,
    },
    {
      accessorKey: "submitted_at",
      header: t("Submitted At"),
      cell: ({ row }) => {
        const val = String(row.getValue("submitted_at"));

        return (
          <div className="flex flex-col items-center">
            {/* Sana qismi */}
            <Badge
              variant="outline"
            >
              {val?.slice(0, 10)}
            </Badge>

            {/* Soat qismi (kichikroq va xiraroq) */}
            <span className="text-xs text-muted-foreground">
              {val?.slice(11, 16)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: t("Action"),
      cell: ({ row }) => (
        <div className="flex gap-2">
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
