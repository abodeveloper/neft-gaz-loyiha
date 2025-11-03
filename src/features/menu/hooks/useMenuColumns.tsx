import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // shadcn table ishlatayotgan deb hisoblaymiz
import { toastService } from "@/lib/toastService";
import ConfirmationDialog from "@/shared/components/atoms/confirmation-dialog/ConfirmationDialog";
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { deleteMenu } from "../api/menu";
import { Menu } from "../types";
import CreateMenuModal from "../components/CreateMenuModal";

export function useMenuColumns(): ColumnDef<Menu>[] {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
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
      accessorKey: "page_slug",
      header: t("Slug"),
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("page_slug")}</Badge>
      ),
    },
    {
      accessorKey: "children",
      header: t("Children"),
      cell: ({ row }) => {
        const children = row.getValue("children") as Menu[] | null;
        if (!children || children.length === 0)
          return <Badge variant={"secondary"}>{t("None")}</Badge>;

        return (
          <div className="space-y-4">
            <div className="mt-2 border rounded-md overflow-hidden">
              <Table className="border-collapse w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Title (uz)")}</TableHead>
                    <TableHead>{t("Title (ru)")}</TableHead>
                    <TableHead>{t("Title (en)")}</TableHead>
                    <TableHead>{t("Slug")}</TableHead>
                    <TableHead>{t("Position")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead>{t("Action")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {children?.map((child) => (
                    <TableRow key={child.id}>
                      <TableCell>{child.title_uz}</TableCell>
                      <TableCell>{child.title_ru}</TableCell>
                      <TableCell>{child.title_en}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{child.page_slug}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{child.position}</Badge>
                      </TableCell>
                      <TableCell>
                        {child.status ? (
                          <Badge variant="success">{t("Active")}</Badge>
                        ) : (
                          <Badge variant="destructive">{t("Inactive")}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`update/${child.id}`)}
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
                            description={t(
                              "Are you sure you want to delete this menu item ?"
                            )}
                            onConfirm={() => deleteItem(child.id)}
                            confirmText={t("Yes, Delete")}
                            cancelText={t("No, Cancel")}
                            isLoading={isDeleting}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <CreateMenuModal parentId={row.original.id} />
          </div>
        );
      },
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
            description={t("Are you sure you want to delete this menu item ?")}
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
