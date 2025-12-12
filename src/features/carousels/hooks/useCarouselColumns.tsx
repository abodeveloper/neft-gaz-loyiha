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
      id: "title",
      header: t("Title"),
      cell: ({ row }) => {
        const news = row.original;
        const title = localized(news, "title");

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
      cell: ({ row }) => {
        const imageUrl = row.getValue("image") as string;
        return <div>{imageUrl && <ImageGallery images={[imageUrl]} />}</div>;
      },
    },
    {
      accessorKey: "link",
      header: t("Link"),
      cell: ({ row }) => (
        <div>
          <Badge variant="secondary">{row.getValue("link")}</Badge>
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
