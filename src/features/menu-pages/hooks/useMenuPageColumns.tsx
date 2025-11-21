import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiEyeLine } from "@remixicon/react";
import { ColumnDef } from "@tanstack/react-table";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MenuPage } from "../types";

export function useMenuColumns(): ColumnDef<MenuPage>[] {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return [
    {
      accessorKey: "menu",
      header: t("Menu"),
      cell: ({ row }) => {
        const menu = row.getValue("menu");

        return <div>{get(menu, "title_uz")}</div>;
      },
    },
    {
      accessorKey: "slug",
      header: t("Slug"),
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("slug")}</Badge>
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
      size: 40,
      header: t("Action"),
      cell: ({ row }) => {
        const id = row.getValue("id");

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/dashboard/menu-pages/view/${id}`)}
              title={t("View")}
              className="h-8 w-8"
            >
              <RiEyeLine className="h-4 w-4" />
            </Button>

            {/* <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/dashboard/menus/update/${id}`)}
              title={t("Edit")}
              className="h-8 w-8"
            >
              <RiEditLine className="h-4 w-4" />
            </Button> */}
          </div>
        );
      },
    },
  ];
}
