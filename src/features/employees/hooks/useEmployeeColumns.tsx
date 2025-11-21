import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      accessorKey: "full_name_uz",
      header: t("Full name (uz)"),
      cell: ({ row }) => <div>{row.getValue("full_name_uz")}</div>,
    },
    {
      accessorKey: "full_name_ru",
      header: t("Full name (ru)"),
      cell: ({ row }) => <div>{row.getValue("full_name_ru")}</div>,
    },
    {
      accessorKey: "full_name_en",
      header: t("Full name (en)"),
      cell: ({ row }) => <div>{row.getValue("full_name_en")}</div>,
    },
    {
      accessorKey: "position_uz",
      header: t("Position (uz)"),
      cell: ({ row }) => <div>{row.getValue("position_uz")}</div>,
    },
    {
      accessorKey: "position_ru",
      header: t("Position (ru)"),
      cell: ({ row }) => <div>{row.getValue("position_ru")}</div>,
    },
    {
      accessorKey: "position_en",
      header: t("Position (en)"),
      cell: ({ row }) => <div>{row.getValue("position_en")}</div>,
    },
    {
      accessorKey: "image",
      header: t("Image"),
      size: 250,
      cell: ({ row }) => {
        const imageUrl = row.getValue("image") as string;
        return (
          <div>
            {imageUrl && <ImageGallery images={[imageUrl]} />}
          </div>
        );
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
      size: 100,
      header: t("Action"),
      cell: ({ row }) => (
        <div className="flex gap-2">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`view/${row.getValue("id")}`)}
            title={t("View")}
            disabled={isDeleting}
          >
            <RiEyeLine className="h-4 w-4" />
          </Button> */}
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
