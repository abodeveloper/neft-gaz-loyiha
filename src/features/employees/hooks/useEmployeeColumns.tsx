import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { localized } from "@/i18n";
import { toastService } from "@/lib/toastService";
import ConfirmationDialog from "@/shared/components/atoms/confirmation-dialog/ConfirmationDialog";
import ImageGallery from "@/shared/components/atoms/image-gallery/ImageGallery";
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react"; // Remix Icon
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { deleteEmployee } from "../api/employees";
import { Employee } from "../types";

export function useEmployeeColumns(): ColumnDef<Employee>[] {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Delete mutation
  const { mutate: deleteItemMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
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
      id: "full_name",
      header: t("Full Name"),
      cell: ({ row }) => {
        const employee = row.original;
        const full_name = localized(employee, "full_name");

        return (
          <div
            className="max-w-md truncate font-medium"
            title={full_name || undefined}
          >
            {full_name || (
              <span className="text-muted-foreground">{t("No full name")}</span>
            )}
          </div>
        );
      },
    },
    {
      id: "position",
      header: t("Order"),
      cell: ({ row }) => {
        const employee = row.original;
        const position = localized(employee, "position");

        return (
          <div
            className="max-w-md truncate font-medium"
            title={position || undefined}
          >
            {position || (
              <span className="text-muted-foreground">{t("No full name")}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "image",
      header: t("Image"),
      size: 100,
      cell: ({ row }) => {
        const imageUrl = row.getValue("image") as string;
        return <div>{imageUrl && <ImageGallery images={[imageUrl]} />}</div>;
      },
    },
    {
      accessorKey: "phone",
      header: t("Phone"),
      cell: ({ row }) => (
        <div>
          <Badge variant="secondary">{row.getValue("phone")}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: t("Phone"),
      cell: ({ row }) => (
        <div>
          <Badge variant="secondary">{row.getValue("phone")}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: t("Phone"),
      cell: ({ row }) => (
        <div>
          <Badge variant="secondary">{row.getValue("phone")}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: t("Phone"),
      cell: ({ row }) => (
        <div>
          <Badge variant="secondary">{row.getValue("phone")}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: t("Phone"),
      cell: ({ row }) => (
        <div>
          <Badge variant="secondary">{row.getValue("phone")}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: t("Phone"),
      cell: ({ row }) => (
        <div>
          <Badge variant="secondary">{row.getValue("phone")}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: t("Email"),
      cell: ({ row }) => (
        <div>
          <Badge variant="outline">{row.getValue("email")}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "order",
      header: t("Order"),
      cell: ({ row }) => (
        <div>
          <Badge variant="default">{row.getValue("order")}</Badge>
        </div>
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
