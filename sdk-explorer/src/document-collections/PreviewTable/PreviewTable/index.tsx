import { Button, Card, Checkbox, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { Suspense, useMemo, useState } from "react";
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

import { BookDocument } from "../types";
import { Table, TD, TH, TR } from "../components/TableElements";
import { columns } from "./columns";

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
                      <Suspense fallback={<Spinner />}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Suspense>
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
