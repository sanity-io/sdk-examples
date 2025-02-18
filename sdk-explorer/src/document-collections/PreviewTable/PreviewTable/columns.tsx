import { createColumnHelper } from "@tanstack/react-table";
import { BookDocument } from "../types";
import { Button, Flex, Text } from "@sanity/ui";
import { Checkbox } from "@sanity/ui";
import {
  AuthorsCellSkeleton,
  BookCoverSkeleton,
  DebugCell,
  DocumentActionsSkeleton,
  DocumentSyncStatusSkeleton,
  ReleaseDateCellSkeleton,
  StatusCellSkeleton,
  TitleCellSkeleton,
} from "./cells";
import { getIcon } from "../utils";

const columnHelper = createColumnHelper<BookDocument>();

// hacky feature flag to disable columns
export const columnConfig: Record<string, boolean> = {
  _select: true,
  _documentSyncStatus: true,
  cover: true,
  title: true,
  status: true,
  authors: true,
  releaseDate: true,
  _action: true,
  debug: false,
};

export const columns = [
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
    cell: (info) => <DocumentSyncStatusSkeleton doc={info.getValue()} />,
  }),
  columnHelper.accessor((row) => row, {
    id: "cover",
    header: () => <Button text="Cover" disabled mode="bleed" />,
    cell: (info) => <BookCoverSkeleton doc={info.getValue()} />,
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
    cell: (info) => <TitleCellSkeleton doc={info.getValue()} />,
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
    cell: (info) => (
      <StatusCellSkeleton
        doc={info.getValue()}
        selectedRows={info.table.getSelectedRowModel().rows}
      />
    ),
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
    cell: (info) => <AuthorsCellSkeleton doc={info.getValue()} />,
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
      <ReleaseDateCellSkeleton
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
      <DocumentActionsSkeleton
        doc={info.getValue()}
        selectedRows={info.table.getSelectedRowModel().rows}
      />
    ),
  }),
  columnHelper.accessor((row) => row, {
    id: "debug",
    cell: (info) => <DebugCell doc={info.getValue()} />,
  }),
].filter((column) => column.id && columnConfig[column.id]);
