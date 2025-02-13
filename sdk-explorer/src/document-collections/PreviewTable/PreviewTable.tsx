import { deleteDocument, DocumentHandle, publishDocument } from "@sanity/sdk";
import {
  useDocuments,
  usePreview,
  UsePreviewResults,
  useDocument,
  useEditDocument,
  useApplyActions,
} from "@sanity/sdk-react/hooks";
import {
  Button,
  Card,
  CardProps,
  Checkbox,
  Flex,
  Select,
  Spinner,
  Stack,
  Text,
  TextInput,
} from "@sanity/ui";
import { useMemo, useState, ReactElement } from "react";
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
import {
  DotIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PublishIcon,
  ResetIcon,
} from "@sanity/icons";

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

function AuthorsCell({ doc }: { doc: DocumentHandle }): ReactElement | null {
  const data = useDocument(doc._id);

  if (!data) {
    return <Spinner />;
  }

  if (Array.isArray(data.authors)) {
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

function ReleaseDateCell({ doc }: { doc: DocumentHandle }): ReactElement {
  const data = useDocument(doc._id);
  const editDocument = useEditDocument(doc._id, "releaseDate");

  if (!data) {
    return <Spinner />;
  }

  return (
    <TextInput
      value={data.releaseDate as string}
      onChange={(e) => editDocument(e.currentTarget.value)}
    />
  );
}

function StatusCell({
  doc,
  selectedIds,
}: {
  doc: DocumentHandle;
  selectedIds: string[];
}): ReactElement | null {
  const data = useDocument(doc._id);
  const editDocument = useEditDocument(doc._id, "status");
  const applyActions = useApplyActions();

  if (!data) {
    return <Spinner />;
  }

  const CARD_TONES: Record<string, CardProps["tone"]> = {
    featured: "critical",
    new: "positive",
    bestseller: "primary",
    "coming-soon": "caution",
  };

  const status = data.status as string;

  const handleStatusChange = (newStatus: string) => {
    // If this document is selected, update all selected documents
    if (selectedIds.includes(doc._id)) {
      const actions = selectedIds.map((id) => ({
        type: "document.edit" as const,
        documentId: id.replace("drafts.", ""),
        patches: [{ set: { status: newStatus } }],
      }));
      applyActions(actions);
    } else {
      // Otherwise just update this document
      editDocument(newStatus);
    }
  };

  return (
    <Card tone={CARD_TONES[status]}>
      <Select
        value={status}
        onChange={(e) => handleStatusChange(e.currentTarget.value)}
      >
        <option value="">Select status</option>
        <option value="featured">Featured</option>
        <option value="new">New</option>
        <option value="bestseller">Bestseller</option>
        <option value="coming-soon">Coming Soon</option>
      </Select>
    </Card>
  );
}

function DocumentActions({
  doc,
  selectedIds,
}: {
  doc: DocumentHandle;
  selectedIds: string[];
}): ReactElement {
  const data = useDocument(doc._id);
  const isDraft = data?._id.startsWith("drafts.");
  const actionIds = selectedIds.length ? selectedIds : [doc._id];
  const publishedActionIds = actionIds.map((id) => id.replace("drafts.", ""));

  const applyActions = useApplyActions();
  const publishActions = publishedActionIds.map((id) => publishDocument(id));

  if (!data) {
    return <Spinner />;
  }

  return (
    <Flex gap={1} justify="center">
      <Button
        icon={PublishIcon}
        disabled={!isDraft}
        tone="primary"
        mode={isDraft ? "default" : "ghost"}
        onClick={() => applyActions(publishActions)}
      />
    </Flex>
  );
}

function PreviewTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [previewCache, setPreviewCache] = useState<PreviewCache>({});
  const [selected, setSelected] = useState<string[]>([]);
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
        id: "_select",
        header: () => <Button text="Select" disabled mode="bleed" />,
        enableSorting: false,
        cell: (info) => {
          const document = info.getValue();
          return (
            <Flex justify="center">
              <Checkbox
                checked={selected.includes(document._id)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.checked) {
                    setSelected((prev) => [...prev, document._id]);
                  } else {
                    setSelected((prev) =>
                      prev.filter((id) => id !== document._id)
                    );
                  }
                }}
              />
            </Flex>
          );
        },
      }),
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
        id: "status",
        header: () => <Button text="Status" disabled mode="bleed" />,
        enableSorting: false,
        cell: (info) => (
          <StatusCell doc={info.getValue()} selectedIds={selected} />
        ),
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
        cell: (info) => <AuthorsCell doc={info.getValue()} />,
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
        sortingFn: () => 0,
      }),
      columnHelper.accessor((row) => row, {
        id: "_action",
        header: () => <Button disabled mode="bleed" text="Action" />,
        cell: (info) => (
          <DocumentActions doc={info.getValue()} selectedIds={selected} />
        ),
        sortingFn: () => 0,
      }),
    ],
    [columnHelper, previewCache, selected]
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

  if (isPending && !data) {
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
