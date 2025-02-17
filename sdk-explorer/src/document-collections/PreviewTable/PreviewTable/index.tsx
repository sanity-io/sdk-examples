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
} from "@tanstack/react-table";
import ExampleLayout from "../../../ExampleLayout";
import { getIcon } from "../utils/table";
import {
  StatusCell,
  AuthorsCell,
  ReleaseDateCell,
  DocumentActions,
  DocumentSyncStatusCell,
  BookCover,
  TitleCell,
} from "../components/cells";
import { BookDocument } from "../types";
import { Table, TD, TH, TR } from "../components/TableElements";

const columnHelper = createColumnHelper<BookDocument>();

interface PreviewTableProps {
  results: BookDocument[];
  isPending: boolean;
  loadMore: () => void;
  hasMore: boolean;
  count: number;
}

function PreviewTable(props: PreviewTableProps) {
  const { results, isPending, loadMore, hasMore, count } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "_select",
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
      }),
      columnHelper.accessor((row) => row, {
        id: "cover",
        header: () => <Button text="Cover" disabled mode="bleed" />,
        enableSorting: false,
        cell: (info) => <BookCover doc={info.getValue()} />,
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
        cell: (info) => <TitleCell doc={info.getValue()} />,
      }),
      // Example of a bulk edit with selected rows
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
      }),
      // Example of retrieving an array of references
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
        cell: (info) => <AuthorsCell doc={info.getValue()} />,
      }),
      // Example of a single field edit
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
        cell: (info) => (
          <ReleaseDateCell
            doc={info.getValue()}
            selectedRows={info.table.getSelectedRowModel().rows}
          />
        ),
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
            selectedRows={info.table.getSelectedRowModel().rows}
          />
        ),
        sortingFn: () => 0,
      }),
    ],
    []
  );

  const table = useReactTable<BookDocument>({
    data: results,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isPending) {
    return (
      <Flex align="center" justify="center" padding={5}>
        <Spinner />
      </Flex>
    );
  }

  return (
    <ExampleLayout
      title={`Preview Table ${count ? `(${count} documents)` : ""}`}
      codeUrl="https://github.com/sanity-io/sdk-examples/blob/main/sdk-explorer/src/document-collections/PreviewTable/index.tsx"
      hooks={["useDocuments", "usePreview"]}
      styling={["Sanity UI", "Tanstack Table"]}
    >
      <Stack space={4}>
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
        <Button disabled={!hasMore} text="Load more" onClick={loadMore} />
      </Stack>
    </ExampleLayout>
  );
}

export default PreviewTable;
