import { DocumentHandle } from "@sanity/sdk";
import {
  useDocuments,
  usePreview,
  UsePreviewResults,
  useDocument,
  useEditDocument,
} from "@sanity/sdk-react/hooks";
import {
  Button,
  Card,
  Flex,
  Spinner,
  Stack,
  Text,
  TextInput,
} from "@sanity/ui";
import { useMemo, useState } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
  SortDirection,
} from "@tanstack/react-table";
import ExampleLayout from "../../ExampleLayout";
import { DotIcon, ChevronDownIcon, ChevronUpIcon } from "@sanity/icons";

function getIcon(isSorted: false | SortDirection) {
  return isSorted === "asc"
    ? ChevronUpIcon
    : isSorted === "desc"
    ? ChevronDownIcon
    : DotIcon;
}

function PreviewCell({
  document,
}: {
  document: DocumentHandle;
}): UsePreviewResults["results"] | { isLoading: true } {
  const { results, isPending } = usePreview({ document });

  if (isPending) {
    return { isLoading: true };
  }

  return results;
}

type PreviewCache = {
  [key: string]: UsePreviewResults["results"] | { isLoading: true };
};

function AuthorCell({ docId }: { docId: string }) {
  const data = useDocument(docId);

  if (!data) {
    return <Spinner />;
  }

  return (
    <Text size={1}>
      {data.lastName as string}, {data.firstName as string}
    </Text>
  );
}

function AuthorsCell({ doc }: { doc: DocumentHandle }) {
  const data = useDocument(doc._id);

  if (!data) {
    return { isLoading: true };
  } else if (Array.isArray(data.authors)) {
    return (
      <Stack space={2}>
        {data.authors.map((author) => (
          <AuthorCell key={author._ref} docId={author._ref} />
        ))}
      </Stack>
    );
  }

  return <Text size={1}>{JSON.stringify(data.authors)}</Text>;
}

function ReleaseDateCell({ doc }: { doc: DocumentHandle }) {
  const data = useDocument(doc._id);
  const editDocument = useEditDocument(doc._id, "releaseDate");

  if (!data) {
    return { isLoading: true };
  }

  return (
    <TextInput
      value={data.releaseDate as string}
      onChange={(e) => editDocument(e.currentTarget.value)}
    />
  );
}

function PreviewTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [previewCache, setPreviewCache] = useState<PreviewCache>({});
  const { results: books, isPending } = useDocuments({
    filter: '_type == "book" && defined(releaseDate)',
    sort: [
      { field: "authors[0]->lastName", direction: "asc" },
      { field: "releaseDate", direction: "asc" },
    ],
  });

  const columnHelper = createColumnHelper<DocumentHandle>();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row, {
        id: "cover",
        header: () => <Button text="Cover" disabled mode="bleed" />,
        enableSorting: false,
        cell: (info) => {
          const document = info.getValue();
          const preview = PreviewCell({ document });
          // Update cache with latest preview
          if (!(document._id in previewCache)) {
            setPreviewCache((prev) => ({ ...prev, [document._id]: preview }));
          }
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
          // Update cache with latest preview
          if (!(document._id in previewCache)) {
            setPreviewCache((prev) => ({ ...prev, [document._id]: preview }));
          }
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
          const previewA = previewCache[rowA.original._id];
          const previewB = previewCache[rowB.original._id];
          if (
            !previewA ||
            !previewB ||
            "isLoading" in previewA ||
            "isLoading" in previewB
          )
            return 0;
          return previewA.title.localeCompare(previewB.title);
        },
      }),
      columnHelper.accessor((row) => row, {
        id: "subtitle",
        header: ({ column }) => (
          <Button
            onClick={() => column.toggleSorting()}
            mode={column.getIsSorted() ? "ghost" : "bleed"}
            iconRight={getIcon(column.getIsSorted())}
            text="Subtitle"
          />
        ),
        cell: (info) => {
          const document = info.getValue();
          const preview = PreviewCell({ document });
          // Update cache with latest preview
          if (!(document._id in previewCache)) {
            setPreviewCache((prev) => ({ ...prev, [document._id]: preview }));
          }
          if ("isLoading" in preview) {
            return <Spinner />;
          }
          return (
            <Text size={1} muted>
              {preview.subtitle}
            </Text>
          );
        },
        sortingFn: (rowA, rowB) => {
          const previewA = previewCache[rowA.original._id];
          const previewB = previewCache[rowB.original._id];
          if (
            !previewA ||
            !previewB ||
            "isLoading" in previewA ||
            "isLoading" in previewB
          )
            return 0;
          return (previewA.subtitle || "").localeCompare(
            previewB.subtitle || ""
          );
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
        cell: (info) => {
          const result = <AuthorsCell doc={info.getValue()} />;
          if ("isLoading" in result) {
            return <Spinner />;
          }
          return result;
        },
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
        cell: (info) => {
          const result = <ReleaseDateCell doc={info.getValue()} />;
          // Handle both Element and {isLoading} return types
          if ("isLoading" in result) {
            return <Spinner />;
          }
          return result;
        },
        sortingFn: (rowA, rowB) => {
          // Sorting would require caching author names similar to preview cache
          // For now, return 0 to skip sorting
          return 0;
        },
      }),
    ],
    [columnHelper, previewCache]
  );

  const data = useMemo(() => books, [books]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
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
      title="Preview Table"
      codeUrl="https://github.com/sanity-io/sdk-examples/blob/main/sdk-explorer/src/document-collections/PreviewTable/PreviewTable.tsx"
      hooks={["useDocuments", "usePreview"]}
      styling="Sanity UI"
    >
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Card
                key={headerGroup.id}
                as="tr"
                style={{ display: "table-row" }}
              >
                {headerGroup.headers.map((header) => (
                  <Card
                    key={header.id}
                    as="th"
                    padding={2}
                    style={{ display: "table-cell", textAlign: "left" }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Card>
                ))}
              </Card>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <Card key={row.id} as="tr" style={{ display: "table-row" }}>
                {row.getVisibleCells().map((cell) => (
                  <Card
                    key={cell.id}
                    as="td"
                    padding={2}
                    borderTop
                    style={{ display: "table-cell" }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Card>
                ))}
              </Card>
            ))}
          </tbody>
        </table>
      </Card>
    </ExampleLayout>
  );
}

export default PreviewTable;
