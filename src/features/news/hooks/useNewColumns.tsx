import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiDeleteBinLine, RiEditLine, RiEyeLine } from "@remixicon/react"; // Remix Icon
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { deleteNews } from "../api/news";
import { News, NewsType } from "../types";
import ConfirmationDialog from "@/shared/components/atoms/confirmation-dialog/ConfirmationDialog";
import { toastService } from "@/lib/toastService";

export function useNewColumns(): ColumnDef<News>[] {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Delete mutation
  const { mutate: deleteNewsMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toastService.success("Succesfully deleted !");
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
      header: "Title uz",
      cell: ({ row }) => <div>{row.getValue("title_uz")}</div>,
    },
    {
      accessorKey: "title_ru",
      header: "Title ru",
      cell: ({ row }) => <div>{row.getValue("title_ru")}</div>,
    },
    {
      accessorKey: "title_en",
      header: "Title en",
      cell: ({ row }) => <div>{row.getValue("title_en")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div>
          <Badge variant="default">
            {row.getValue("type") === NewsType.NEWS ? "News" : "Announcement"}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div>
          {row.getValue("status") ? (
            <Badge variant="success">Active</Badge>
          ) : (
            <Badge variant="destructive">Inactive</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "id",
      size: 20,
      minSize: 500,
      header: "Action",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/news/${row.getValue("id")}`)}
            title="View"
            disabled={isDeleting}
          >
            <RiEyeLine className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`update/${row.getValue("id")}`)}
            title="Edit"
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
                title="Delete"
              >
                <RiDeleteBinLine className="h-4 w-4" />
              </Button>
            }
            title="Delete Item"
            description="Are you sure you want to delete this news item ?"
            onConfirm={() => deleteItem(row.getValue("id"))}
            confirmText="Yes, Delete"
            cancelText="No, Cancel"
            isLoading={isDeleting}
          />
        </div>
      ),
    },
  ];
}
