import { DocumentHandle, publishDocument, discardDocument } from "@sanity/sdk";
import {
  usePreview,
  useDocument,
  useEditDocument,
  useApplyActions,
  useDocumentSyncStatus,
} from "@sanity/sdk-react/hooks";
import {
  Box,
  Button,
  Card,
  Flex,
  Select,
  Spinner,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@sanity/ui";
import { ReactElement, Suspense, useCallback, useMemo, useRef } from "react";
import { DotIcon, PublishIcon, ResetIcon } from "@sanity/icons";
import { BookDocument } from "../types";
import { RowModel } from "@tanstack/react-table";

export function BookCover({ doc }: { doc: DocumentHandle }) {
  const ref = useRef(null);
  const { results } = usePreview({ document: doc, ref });

  if (!results?.media) {
    return <Spinner />;
  }

  return (
    <Card ref={ref} tone="transparent" shadow={1} style={{ width: 64 }}>
      <img
        src={results.media.url}
        alt={results.title}
        width="64"
        height="96"
        style={{ objectFit: "cover" }}
      />
    </Card>
  );
}

export function TitleCell({ doc }: { doc: DocumentHandle }) {
  const ref = useRef(null);
  const { results } = usePreview({ document: doc, ref });

  if (!results?.title) {
    return <Spinner />;
  }

  return (
    <Text ref={ref} weight="medium" size={2}>
      {results.title}
    </Text>
  );
}

export function AuthorCell({ document }: { document: DocumentHandle }) {
  const ref = useRef(null);
  const { results } = usePreview({ document });

  if (!results) {
    return <Spinner />;
  }

  return (
    <Text ref={ref} size={1}>
      {results.title}
    </Text>
  );
}

export function AuthorsCell({
  doc,
}: {
  doc: DocumentHandle;
}): ReactElement | null {
  const data = useDocument(doc._id);
  const authors = useMemo(() => {
    if (!data) {
      return [];
    }

    return Array.isArray(data.authors) ? data.authors : [];
  }, [data]);

  if (!data) {
    return <Spinner />;
  }

  return (
    <Stack space={2}>
      {authors.map((author) => (
        <Suspense key={author._ref} fallback="Loading author">
          <AuthorCell document={{ _id: author._ref, _type: "author" }} />
        </Suspense>
      ))}
    </Stack>
  );
}

// This component is an example of useEditDocument
// this is why it's disabled when multiple rows are selected
export function ReleaseDateCell({
  doc,
  selectedRows,
}: {
  doc: DocumentHandle;
  selectedRows: RowModel<BookDocument>["rows"];
}): ReactElement {
  const editDocument = useEditDocument(doc._id, "releaseDate");
  const data = useDocument(doc._id);
  const isDraft = data?._id.startsWith("drafts.");

  if (!data) {
    return <Spinner />;
  }

  return (
    <Card tone={isDraft ? "caution" : "default"}>
      <TextInput
        value={(data.releaseDate as string) || ""}
        onChange={(e) => editDocument(e.currentTarget.value)}
        disabled={selectedRows.length > 1}
      />
    </Card>
  );
}

interface StatusCellProps {
  doc: DocumentHandle;
  selectedRows: RowModel<BookDocument>["rows"];
}

export function StatusCell({ doc, selectedRows }: StatusCellProps) {
  const data = useDocument(doc._id);
  const applyActions = useApplyActions();
  const isDraft = data?._id.startsWith("drafts.");

  const selectedIds = useMemo(
    () =>
      selectedRows.length
        ? selectedRows.map(
            (row: { original: DocumentHandle }) => row.original._id
          )
        : [doc._id],
    [selectedRows, doc._id]
  );

  const handleStatusChange = useCallback(
    (newStatus: string) => {
      const actions = selectedIds.map((documentId: string) => ({
        type: "document.edit" as const,
        documentId,
        patches: [
          newStatus ? { set: { status: newStatus } } : { unset: ["status"] },
        ],
      }));

      applyActions(actions);
    },
    [applyActions, selectedIds]
  );

  if (!data) {
    return <Spinner />;
  }

  return (
    <Card tone={isDraft ? "caution" : "default"}>
      <Select
        value={(data.status as string) || ""}
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

export function DocumentActions({
  doc,
  selectedRows,
}: {
  doc: DocumentHandle;
  selectedRows: RowModel<BookDocument>["rows"];
}): ReactElement {
  const data = useDocument(doc._id);
  const isDraft = data?._id.startsWith("drafts.");

  const selectedIds = selectedRows.map((row) => row.original._id);
  const actionIds = selectedIds.length ? selectedIds : [doc._id];

  const applyActions = useApplyActions();
  const publishActions = actionIds.map((id) => publishDocument(id));
  const discardActions = actionIds.map((id) => discardDocument(id));

  if (!data) {
    return <Spinner />;
  }

  return (
    <Flex gap={1} justify="center">
      <Tooltip
        content={
          <Box padding={1}>
            <Text muted size={1}>
              Publish {actionIds.length} {actionIds.length > 1 && `selected`}{" "}
              document{actionIds.length === 1 ? "" : "s"}
            </Text>
          </Box>
        }
      >
        <Button
          icon={PublishIcon}
          disabled={!isDraft}
          tone="primary"
          mode={isDraft ? "default" : "ghost"}
          onClick={() => applyActions(publishActions)}
        />
      </Tooltip>
      <Tooltip
        content={
          <Box padding={1}>
            <Text muted size={1}>
              Discard {actionIds.length} {actionIds.length > 1 && `selected`}{" "}
              draft{actionIds.length === 1 ? "" : "s"}
            </Text>
          </Box>
        }
      >
        <Button
          icon={ResetIcon}
          disabled={!isDraft}
          tone="critical"
          mode={isDraft ? "default" : "ghost"}
          onClick={() => applyActions(discardActions)}
        />
      </Tooltip>
    </Flex>
  );
}

export function DocumentSyncStatusCell({ doc }: { doc: DocumentHandle }) {
  const synced = useDocumentSyncStatus(doc._id);

  return (
    <Card
      tone={synced ? "positive" : "critical"}
      padding={0}
      style={{ width: 15, height: 15, borderRadius: 10 }}
    >
      <Flex height="fill" align="center" justify="center">
        <Text size={1}>
          <DotIcon />
        </Text>
      </Flex>
    </Card>
  );
}

export function DebugCell({ doc }: { doc: DocumentHandle }) {
  const data = useDocument(doc._id);
  const preview = usePreview({ document: doc });
  const syncStatus = useDocumentSyncStatus(doc._id);
  // const editDocument = useEditDocument(doc._id, "releaseDate");
  // const applyActions = useApplyActions();
  // const publishActions = [publishDocument(doc._id)];
  // const isDraft = data?._id.startsWith("drafts.");

  return (
    <Card padding={3} tone="inherit">
      <Stack space={5}>
        <MiniDocEditor doc={doc} path="releaseDate" />
        <MiniDocEditor doc={doc} path="title" />
        <MiniDocEditor doc={doc} path="status" />
        <Text>{JSON.stringify(doc)}</Text>
        <Text>{JSON.stringify(data)}</Text>
        <Text>{JSON.stringify(preview)}</Text>
        <Text>{JSON.stringify(syncStatus)}</Text>
        <ReleaseDateCell doc={doc} selectedRows={[]} />
        <StatusCell doc={doc} selectedRows={[]} />
        {/* <Flex gap={2}>
          <Card flex={1} tone={isDraft ? "caution" : "default"}>
            <TextInput
              padding={4}
              value={data?.releaseDate as string}
              onChange={(e) => editDocument(e.currentTarget.value)}
            />
          </Card>
          <Button
            disabled={!isDraft}
            onClick={() => applyActions(publishActions)}
          >
            Publish
          </Button>
        </Flex> */}
      </Stack>
    </Card>
  );
}

export function MiniDocEditor({
  doc,
  path,
}: {
  doc: DocumentHandle;
  path: string;
}) {
  const data = useDocument(doc._id);
  const value = (data?.[path] as string) || "";
  const editDocument = useEditDocument(doc._id, path);
  const isDraft = data?._id.startsWith("drafts.");

  return (
    <Card tone={isDraft ? "caution" : "default"}>
      <Stack space={2}>
        <Text muted>{path}</Text>
        <TextInput
          padding={4}
          value={value}
          onChange={(e) => editDocument(e.currentTarget.value)}
        />
      </Stack>
    </Card>
  );
}
