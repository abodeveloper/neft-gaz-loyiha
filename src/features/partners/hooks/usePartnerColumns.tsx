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
import { deletePartner } from "../api/partners";
import { Partner } from "../types";

export function usePartnerColumns(): ColumnDef<Partner>[] {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Delete mutation
  const { mutate: deleteItemMutation, isPending: isDeleting } = useMutation({
    mutationFn: deletePartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
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
      cell: ({ row }) => {
        const item = row.original;
        const title = localized(item, "title");

        return (
          <div
            className="max-w-md truncate font-medium"
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
      accessorKey: "image",
      header: t("Image"),
      size: 100,
      cell: ({ row }) => {
        const imageUrl = row.getValue("image") as string;
        return <div>{imageUrl && <ImageGallery images={[imageUrl]} />}</div>;
      },
    },
    {
      accessorKey: "link",
      header: t("Link"),
      cell: ({ row }) => (
        <a
          href={row.getValue("link")}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <Badge variant="secondary">{row.getValue("link")}</Badge>
        </a>
      ),
    },

    {
      accessorKey: "position",
      header: t("Order"),
      cell: ({ row }) => (
        <div>
          <Badge variant="default">{row.getValue("position")}</Badge>
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
