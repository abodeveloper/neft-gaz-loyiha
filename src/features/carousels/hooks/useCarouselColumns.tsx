import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toastService } from "@/lib/toastService";
import ConfirmationDialog from "@/shared/components/atoms/confirmation-dialog/ConfirmationDialog";
import { RiDeleteBinLine, RiEditLine, RiEyeLine } from "@remixicon/react"; // Remix Icon
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { deleteCarousel } from "../api/carousels";
import { Carousel } from "../types";

export function useCarouselColumns(): ColumnDef<Carousel>[] {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Delete mutation
  const { mutate: deleteNewsMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteCarousel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toastService.success(t("Succesfully deleted !"));
    },
    onError: (error) => {
      toastService.error(error.message);
    },
  });

  const deleteItem = (id: number) => {
    deleteNewsMutation(id);
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
      accessorKey: "image",
      header: t("Image"),
      cell: ({ row }) => {
        const imageUrl = row.getValue("image") as string;
        return (
          <div>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="News"
                className="w-20 rounded-md object-cover"
              />
            ) : (
              <div className="w-20 h-12 rounded-md bg-muted" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "link",
      header: t("Link"),
      cell: ({ row }) => (
        <div>
          <Badge variant="default">{row.getValue("link")}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "position",
      header: t("Position"),
      cell: ({ row }) => (
        <div>
          <Badge variant="default">{row.getValue("position")}</Badge>
        </div>
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
      accessorKey: "id",
      size: 100,
      header: t("Action"),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`view/${row.getValue("id")}`)}
            title={t("View")}
            disabled={isDeleting}
          >
            <RiEyeLine className="h-4 w-4" />
          </Button>
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
