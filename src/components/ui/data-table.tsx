import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
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
    columnResizeMode: "onChange",
    manualPagination: pagination,
    pageCount: pagination ? totalPages : undefined,
    state: {
      pagination: pagination
        ? {
            pageIndex: currentPage - 1,
            pageSize,
          }
        : undefined,
    },
  });

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  
  return (
    <div className="w-full">
      {/* Horizontal scroll container */}
      <div className="w-full overflow-x-auto">
        <div className=" border w-full">
          {/* Table MUST have min-w-max / w-max to enable scrolling */}
          <Table className="w-max min-w-full rounded-md">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup, hIndex) => (
                <TableRow key={headerGroup.id}>
                  {/* № column */}
                  {hIndex === 0 && (
                    <TableHead
                      style={{ width: 60 }}
                      className="text-center sticky left-0 bg-background z-10"
                    >
                      №
                    </TableHead>
                  )}

                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{
                        width: (header.column.columnDef as any).size || "auto",
                      }}
                      className="whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1}>
                    <LoadingSpinner
                      className="min-h-[350px]"
                      message={t("Loading data ...")}
                    />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, rowIndex) => (
                  <TableRow
                    key={row.id}
                    className={`${
                      onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                    }`}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    <TableCell
                      className="text-center sticky left-0 bg-background z-10"
                      style={{ width: 60, minWidth: 60 }}
                    >
                      {start + rowIndex}
                    </TableCell>

                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: (cell.column.columnDef as any).size || "auto",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-[250px] text-center"
                  >
                    {t("No data available.")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {pagination && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm flex items-center justify-start w-[100px]">
            {`${start}-${end} / ${totalCount}`}
          </div>

          <Pagination className="flex items-center justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange?.(Math.max(currentPage - 1, 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  title={t("Previous")}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => onPageChange?.(pageNum)}
                      isActive={pageNum === currentPage}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

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
                  title={t("Next")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
