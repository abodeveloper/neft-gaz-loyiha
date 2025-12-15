import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Employee } from "@/features/employees/types";
import { localized } from "@/i18n";
import ImageGallery from "@/shared/components/atoms/image-gallery/ImageGallery";
import { RiEditLine } from "@remixicon/react"; // Remix Icon
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function useEmployeeColumns(): ColumnDef<Employee>[] {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      header: t("Position"),
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
      size: 250,
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
            onClick={() =>
              navigate(`/dashboard/employees/update/${row.getValue("id")}`)
            }
            title={t("Edit")}
          >
            <RiEditLine className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}
