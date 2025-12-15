import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pagination?: boolean;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData>({
  data,
  columns,
  pagination = false,
  pageSize = 10,
  totalCount = data.length,
  totalPages = Math.ceil(totalCount / pageSize),
  currentPage = 1,
  onPageChange,
  isLoading = false,
  onRowClick,
}: DataTableProps<TData>) {
  const { t } = useTranslation();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: pagination,
    pageCount: pagination ? totalPages : undefined,
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    state: {
      pagination: pagination
        ? { pageIndex: currentPage - 1, pageSize }
        : undefined,
    },
  });

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  const paginationItems = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          totalPages
        );
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Table Container */}
      <div className="rounded-md border w-full overflow-hidden">
        <div className="w-full overflow-x-auto relative">
          <Table className="w-full min-w-max caption-bottom text-sm">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {/* Sticky Index Header */}
                  <TableHead
                    className="text-center sticky left-0 z-20 bg-background font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                    style={{ width: "60px", minWidth: "60px" }}
                  >
                    №
                  </TableHead>

                  {headerGroup.headers.map((header) => {
                    const isCustomSize = header.column.columnDef.size !== 0;

                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          width: isCustomSize
                            ? header.column.columnDef.size
                            : "auto",
                        }}
                        className={`font-medium px-4 py-3 align-top ${
                          !isCustomSize ? "min-w-[150px]" : ""
                        }`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center p-0"
                  >
                    <div className="sticky left-0 w-full flex justify-center items-center h-[250px]">
                      <LoadingSpinner message={t("Loading data ...")} />
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, rowIndex) => (
                  <TableRow
                    key={row.id}
                    className={
                      onRowClick
                        ? "cursor-pointer hover:bg-muted/50 transition-colors"
                        : ""
                    }
                    onClick={() => onRowClick?.(row.original)}
                  >
                    <TableCell
                      className="text-center sticky left-0 z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] align-top"
                      style={{ width: "60px", minWidth: "60px" }}
                    >
                      <div className="py-2">{start + rowIndex}</div>
                    </TableCell>

                    {row.getVisibleCells().map((cell) => {
                      const isCustomSize = cell.column.columnDef.size !== 0;

                      return (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: isCustomSize
                              ? cell.column.columnDef.size
                              : "auto",
                            maxWidth: isCustomSize
                              ? cell.column.columnDef.size
                              : undefined,
                          }}
                          className={`p-4 align-top ${
                            !isCustomSize ? "min-w-[150px]" : ""
                          }`}
                        >
                          <div className="whitespace-normal break-words w-full">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center p-0"
                  >
                    <div className="sticky left-0 w-full flex justify-center items-center h-[250px]">
                      {t("No data available.")}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* PAGINATION SECTION */}
      {pagination && (
        <div className="flex items-center justify-between py-2 w-full">
          {/* CHAP TOMON: Count */}
          <div className="text-sm text-muted-foreground whitespace-nowrap flex-1">
            {totalCount > 0 && `${start}-${end} / ${totalCount}`}
          </div>

          {/* O'NG TOMON: Buttons */}
          <Pagination className="justify-end w-auto m-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange?.(Math.max(currentPage - 1, 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  title={t("Previous")} // Tarjima qaytarildi
                />
              </PaginationItem>

              {paginationItems.map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => onPageChange?.(page as number)}
                      isActive={page === currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    onPageChange?.(Math.min(currentPage + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  title={t("Next")} // Tarjima qaytarildi
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
