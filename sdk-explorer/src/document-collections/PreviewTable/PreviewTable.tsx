import { DocumentHandle, publishDocument } from "@sanity/sdk";
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
  Radio,
} from "@sanity/ui";
import {
  useMemo,
  useState,
  ReactElement,
  useEffect,
  createContext,
  useContext,
} from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
  SortDirection,
  RowSelectionState,
  Header,
  HeaderGroup,
  Row,
  Cell,
} from "@tanstack/react-table";
import ExampleLayout from "../../ExampleLayout";
import {
  DotIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PublishIcon,
} from "@sanity/icons";
import type { SanityDocument as BaseSanityDocument } from "@sanity/types";

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

interface SanityDocument extends BaseSanityDocument {
  status?: string;
  releaseDate?: string;
  authors?: Array<{ _ref: string }>;
  firstName?: string;
  lastName?: string;
}

type DocumentCache = {
  [key: string]: SanityDocument | null;
};

type TableMeta = {
  documentCache: DocumentCache;
};

type TableContextType = ReturnType<typeof useReactTable<BookDocument>> | null;
const TableContext = createContext<TableContextType>(null);

function useTable() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTable must be used within a TableContext.Provider");
  }
  return context;
}

function AuthorCell({ docId }: { docId: string }) {
  const table = useTable();
  const data = useDocument(docId);

  useEffect(() => {
    if (data) {
      const cache = (table.options.meta as TableMeta)?.documentCache;
      if (cache) {
        cache[docId] = data;
      }
    }
  }, [data, docId, table.options.meta]);

  if (!data) {
    return <Spinner />;
  }

  return (
    <Text size={1}>
      {data.firstName as string} {data.lastName as string}
    </Text>
  );
}

function AuthorsCell({ doc }: { doc: DocumentHandle }): ReactElement | null {
  const table = useTable();
  const data = (table.options.meta as TableMeta)?.documentCache[doc._id];

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
  const table = useTable();
  const editDocument = useEditDocument(doc._id, "releaseDate");
  const data = (table.options.meta as TableMeta)?.documentCache[doc._id];

  if (!data) {
    return <Spinner />;
  }

  return (
    <Card tone="default">
      <TextInput
        value={data.releaseDate as string}
        onChange={(e) => editDocument(e.currentTarget.value)}
      />
    </Card>
  );
}

function StatusCell({ doc }: { doc: DocumentHandle }): ReactElement | null {
  const table = useTable();
  const editDocument = useEditDocument(doc._id, "status");
  const applyActions = useApplyActions();
  const data = (table.options.meta as TableMeta)?.documentCache[doc._id];

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
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row) => row.original._id);

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

function DocumentActions({ doc }: { doc: DocumentHandle }): ReactElement {
  const table = useTable();
  const data = (table.options.meta as TableMeta)?.documentCache[doc._id];
  const isDraft = data?._id.startsWith("drafts.");
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row) => row.original._id);
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

function DocumentFetcherCell({ doc }: { doc: DocumentHandle }) {
  const data = useDocument(doc._id);
  const table = useTable();

  useEffect(() => {
    if (data) {
      const cache = (table.options.meta as TableMeta)?.documentCache;
      if (cache) {
        cache[doc._id] = data;
      }
    }
  }, [data, doc._id, table.options.meta]);

  return null;
}

type BookDocument = DocumentHandle & {
  status?: string;
  authors?: Array<{ _ref: string }>;
  releaseDate?: string;
};

function PreviewTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [previewCache, setPreviewCache] = useState<PreviewCache>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [statusFilter, setStatusFilter] = useState<string>("");
  const documentCache = useMemo<DocumentCache>(() => ({}), []);

  const { results: books, isPending } = useDocuments({
    filter: [
      '_type == "book" && defined(releaseDate)',
      statusFilter && `status == "${statusFilter}"`,
    ]
      .filter(Boolean)
      .join(" && "),
    sort: [
      { field: "authors[0]->lastName", direction: "asc" },
      { field: "releaseDate", direction: "asc" },
    ],
  });

  const columnHelper = createColumnHelper<BookDocument>();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row, {
        id: "_documentFetcher",
        header: () => null,
        cell: (info) => <DocumentFetcherCell doc={info.getValue()} />,
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
        id: "cover",
        header: () => <Button text="Cover" disabled mode="bleed" />,
        enableSorting: false,
        cell: (info) => {
          const document = info.getValue();
          const preview = PreviewCell({ document });
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
        cell: (info) => <StatusCell doc={info.getValue()} />,
        enableSorting: true,
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
      }),
      columnHelper.accessor((row) => row, {
        id: "_action",
        header: () => (
          <Flex justify="center">
            <Button disabled mode="bleed" text="Action" />
          </Flex>
        ),
        cell: (info) => <DocumentActions doc={info.getValue()} />,
        sortingFn: () => 0,
      }),
    ],
    [columnHelper, previewCache, documentCache]
  );

  const table = useReactTable<BookDocument>({
    data: books || [],
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
    meta: {
      documentCache,
    } as TableMeta,
  });

  if (isPending && !books) {
    return (
      <Flex align="center" justify="center" padding={5}>
        <Spinner />
      </Flex>
    );
  }

  return (
    <TableContext.Provider value={table}>
      <ExampleLayout
        title="Preview Table"
        codeUrl="https://github.com/sanity-io/sdk-examples/blob/main/sdk-explorer/src/document-collections/PreviewTable/PreviewTable.tsx"
        hooks={["useDocuments", "usePreview"]}
        styling="Sanity UI"
      >
        <Stack space={4}>
          <Card padding={3}>
            <Flex gap={3} align="center">
              <Text size={1} weight="medium">
                Status:
              </Text>
              <Flex gap={3} wrap="wrap" align="center">
                <Radio
                  id="status-all"
                  checked={statusFilter === ""}
                  name="status"
                  value=""
                  onChange={(e) => setStatusFilter(e.currentTarget.value)}
                />
                <Text as="label" htmlFor="status-all" size={1}>
                  All statuses
                </Text>

                <Radio
                  id="status-featured"
                  checked={statusFilter === "featured"}
                  name="status"
                  value="featured"
                  onChange={(e) => setStatusFilter(e.currentTarget.value)}
                />
                <Text as="label" htmlFor="status-featured" size={1}>
                  Featured
                </Text>

                <Radio
                  id="status-new"
                  checked={statusFilter === "new"}
                  name="status"
                  value="new"
                  onChange={(e) => setStatusFilter(e.currentTarget.value)}
                />
                <Text as="label" htmlFor="status-new" size={1}>
                  New
                </Text>

                <Radio
                  checked={statusFilter === "bestseller"}
                  name="status"
                  value="bestseller"
                  onChange={(e) => setStatusFilter(e.currentTarget.value)}
                />
                <Text as="label" htmlFor="status-bestseller" size={1}>
                  Bestseller
                </Text>

                <Radio
                  id="status-coming-soon"
                  checked={statusFilter === "coming-soon"}
                  name="status"
                  value="coming-soon"
                  onChange={(e) => setStatusFilter(e.currentTarget.value)}
                />
                <Text as="label" htmlFor="status-coming-soon" size={1}>
                  Coming Soon
                </Text>
              </Flex>
            </Flex>
          </Card>
          <Card>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                {table
                  .getHeaderGroups()
                  .map((headerGroup: HeaderGroup<BookDocument>) => (
                    <Card
                      key={headerGroup.id}
                      as="tr"
                      style={{ display: "table-row" }}
                    >
                      {headerGroup.headers.map(
                        (header: Header<BookDocument, unknown>) => (
                          <Card
                            key={header.id}
                            as="th"
                            padding={
                              header.column.id === "_documentFetcher" ? 0 : 2
                            }
                            style={{ display: "table-cell", textAlign: "left" }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </Card>
                        )
                      )}
                    </Card>
                  ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row: Row<BookDocument>) => (
                  <Card key={row.id} as="tr" style={{ display: "table-row" }}>
                    {row
                      .getVisibleCells()
                      .map((cell: Cell<BookDocument, unknown>) => (
                        <Card
                          key={cell.id}
                          as="td"
                          padding={
                            cell.column.id === "_documentFetcher" ? 0 : 2
                          }
                          borderTop
                          tone={row.getIsSelected() ? "primary" : "default"}
                          style={{ display: "table-cell" }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Card>
                      ))}
                  </Card>
                ))}
              </tbody>
            </table>
          </Card>
        </Stack>
      </ExampleLayout>
    </TableContext.Provider>
  );
}

export default PreviewTable;
