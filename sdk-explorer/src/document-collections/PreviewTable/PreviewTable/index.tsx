import { useDocuments } from "@sanity/sdk-react/hooks";
import { Button, Card, Checkbox, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { useMemo, useState } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
  RowSelectionState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import ExampleLayout from "../../../ExampleLayout";
import { getIcon } from "../utils/table";

import {
  PreviewCell,
  StatusCell,
  AuthorsCell,
  ReleaseDateCell,
  DocumentActions,
  DocumentFetcherCell,
  DocumentSyncStatusCell,
} from "../components/cells";
import { BookDocument, TableMeta, DocumentCache } from "../types";
import { Table, TD, TH, TR } from "../components/TableElements";
import { StatusFilter } from "../components/StatusFilter";

function PreviewTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const documentCache = useMemo<DocumentCache>(() => ({}), []);

  const { results: books, isPending } = useDocuments({
    filter: '_type == "book" && defined(releaseDate)',
  });

  const columnHelper = createColumnHelper<BookDocument>();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row, {
        id: "_documentFetcher",
        header: () => null,
        cell: (info) => (
          <DocumentFetcherCell
            doc={info.getValue()}
            meta={info.table.options.meta as TableMeta}
          />
        ),
        size: 0,
        enableSorting: false,
      }),
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Flex justify="center">
            <Checkbox
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          </Flex>
        ),
        cell: ({ row }) => (
          <Flex justify="center">
            <Checkbox
              checked={row.getIsSelected()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </Flex>
        ),
      }),
      columnHelper.accessor((row) => row, {
        id: "_documentSyncStatus",
        header: () => <Text size={1}>Sync</Text>,
        cell: (info) => <DocumentSyncStatusCell doc={info.getValue()} />,
        enableSorting: false,
      }),
      columnHelper.accessor((row) => row, {
        id: "cover",
        header: () => <Button text="Cover" disabled mode="bleed" />,
        enableSorting: false,
        cell: (info) => {
          const document = info.getValue();
          const preview = PreviewCell({ document });
          if ("isLoading" in preview) {
            return <Spinner />;
          }
          if (preview.media?.type === "image-asset") {
            return (
              <Card tone="transparent" shadow={2} style={{ width: 64 }}>
                <img src={preview.media.url} alt="" width="64" />
              </Card>
            );
          }
          return null;
        },
      }),
      columnHelper.accessor((row) => row, {
        id: "title",
        header: ({ column }) => (
          <Button
            onClick={() => column.toggleSorting()}
            mode={column.getIsSorted() ? "ghost" : "bleed"}
            iconRight={getIcon(column.getIsSorted())}
            text="Title"
          />
        ),
        cell: (info) => {
          const document = info.getValue();
          const preview = PreviewCell({ document });
          if ("isLoading" in preview) {
            return <Spinner />;
          }
          return (
            <Text weight="medium" size={2}>
              {preview.title}
            </Text>
          );
        },
        sortingFn: (rowA, rowB) => {
          const previewA = PreviewCell({ document: rowA.original });
          const previewB = PreviewCell({ document: rowB.original });
          if ("isLoading" in previewA || "isLoading" in previewB) return 0;
          return previewA.title.localeCompare(previewB.title);
        },
      }),
      columnHelper.accessor((row) => row, {
        id: "status",
        header: ({ column }) => (
          <Button
            onClick={() => column.toggleSorting()}
            mode={column.getIsSorted() ? "ghost" : "bleed"}
            tone={column.getIsSorted() ? "primary" : "default"}
            iconRight={getIcon(column.getIsSorted())}
            text="Status"
          />
        ),
        cell: (info) => <StatusCell doc={info.getValue()} table={info.table} />,
        enableSorting: true,
        filterFn: (row, columnId, filterValue) => {
          const status = documentCache[row.original._id]?.status;
          return !filterValue || status === filterValue;
        },
        sortingFn: (rowA, rowB) => {
          const rowAId = rowA.original._id;
          const rowBId = rowB.original._id;
          const rowAStatus = documentCache[rowAId]?.status;
          const rowBStatus = documentCache[rowBId]?.status;

          if (!rowAStatus || !rowBStatus) {
            return 0;
          }

          return rowAStatus.localeCompare(rowBStatus);
        },
      }),
      columnHelper.accessor((row) => row, {
        id: "authors",
        header: ({ column }) => (
          <Button
            onClick={() => column.toggleSorting()}
            mode={column.getIsSorted() ? "ghost" : "bleed"}
            iconRight={getIcon(column.getIsSorted())}
            text="Authors"
          />
        ),
        cell: (info) => (
          <AuthorsCell
            doc={info.getValue()}
            meta={info.table.options.meta as TableMeta}
          />
        ),
      }),
      columnHelper.accessor((row) => row, {
        id: "releaseDate",
        header: ({ column }) => (
          <Button
            onClick={() => column.toggleSorting()}
            mode={column.getIsSorted() ? "ghost" : "bleed"}
            iconRight={getIcon(column.getIsSorted())}
            text="Release date"
          />
        ),
        cell: (info) => <ReleaseDateCell doc={info.getValue()} />,
      }),
      columnHelper.accessor((row) => row, {
        id: "_action",
        header: () => (
          <Flex justify="center">
            <Button disabled mode="bleed" text="Action" />
          </Flex>
        ),
        cell: (info) => (
          <DocumentActions
            doc={info.getValue()}
            meta={info.table.options.meta as TableMeta}
            table={info.table}
          />
        ),
        sortingFn: () => 0,
      }),
    ],
    [columnHelper, documentCache]
  );

  const table = useReactTable<BookDocument>({
    data: books || [],
    columns,
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      documentCache,
    } as TableMeta,
  });

  const handleStatusFilterChange = (value: string) => {
    setColumnFilters([{ id: "status", value }]);
  };

  if (isPending && !books) {
    return (
      <Flex align="center" justify="center" padding={5}>
        <Spinner />
      </Flex>
    );
  }

  return (
    <ExampleLayout
      title="Preview Table"
      codeUrl="https://github.com/sanity-io/sdk-examples/blob/main/sdk-explorer/src/document-collections/PreviewTable/index.tsx"
      hooks={["useDocuments", "usePreview"]}
      styling={["Sanity UI", "Tanstack Table"]}
    >
      <Stack space={4}>
        <StatusFilter
          value={(table.getColumn("status")?.getFilterValue() as string) || ""}
          onChange={handleStatusFilterChange}
        />
        <Card>
          <Table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TR key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TH
                      key={header.id}
                      padding={header.column.id === "_documentFetcher" ? 0 : 2}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TH>
                  ))}
                </TR>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <TR key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TD
                      key={cell.id}
                      padding={cell.column.id === "_documentFetcher" ? 0 : 2}
                      borderTop
                      tone={row.getIsSelected() ? "primary" : "default"}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TD>
                  ))}
                </TR>
              ))}
            </tbody>
          </Table>
        </Card>
      </Stack>
    </ExampleLayout>
  );
}

export default PreviewTable;
