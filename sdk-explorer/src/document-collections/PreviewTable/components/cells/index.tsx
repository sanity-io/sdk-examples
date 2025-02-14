import { DocumentHandle, publishDocument, discardDocument } from "@sanity/sdk";
import {
  usePreview,
  UsePreviewResults,
  useDocument,
  useEditDocument,
  useApplyActions,
  useDocumentSyncStatus,
} from "@sanity/sdk-react/hooks";
import {
  Button,
  Card,
  Flex,
  Select,
  Spinner,
  Stack,
  Text,
  TextInput,
} from "@sanity/ui";
import { ReactElement, useEffect } from "react";
import { DotIcon, PublishIcon, ResetIcon, SpinnerIcon } from "@sanity/icons";
import { CARD_TONES, TableMeta, BookDocument } from "../../types";
import { Table as TableType } from "@tanstack/react-table";

export function PreviewCell({
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

export function AuthorCell({
  docId,
  meta,
}: {
  docId: string;
  meta: TableMeta;
}) {
  const data = useDocument(docId);

  useEffect(() => {
    if (data) {
      const cache = meta?.documentCache;
      if (cache) {
        cache[docId] = data;
      }
    }
  }, [data, docId, meta]);

  if (!data) {
    return <Spinner />;
  }

  return (
    <Text size={1}>
      {data.firstName as string} {data.lastName as string}
    </Text>
  );
}

export function AuthorsCell({
  doc,
  meta,
}: {
  doc: DocumentHandle;
  meta: TableMeta;
}): ReactElement | null {
  const data = meta?.documentCache[doc._id];

  if (!data) {
    return <Spinner />;
  }

  if (Array.isArray(data.authors)) {
    return (
      <Stack space={2}>
        {data.authors.map((author) => (
          <AuthorCell key={author._ref} docId={author._ref} meta={meta} />
        ))}
      </Stack>
    );
  }

  return <Text size={1}>{JSON.stringify(data.authors)}</Text>;
}

export function ReleaseDateCell({
  doc,
}: {
  doc: DocumentHandle;
}): ReactElement {
  const editDocument = useEditDocument(doc._id, "releaseDate");
  const data = useDocument(doc._id);

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

export function StatusCell({
  doc,
  table,
}: {
  doc: DocumentHandle;
  table: TableType<BookDocument>;
}): ReactElement | null {
  const applyActions = useApplyActions();
  const data = useDocument(doc._id);

  if (!data) {
    return <Spinner />;
  }

  const status = data.status as string;
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedIds = selectedRows.length
    ? selectedRows.map((row) => row.original._id)
    : [doc._id];

  const handleStatusChange = (newStatus: string) => {
    const actions = selectedIds.map((documentId) => ({
      type: "document.edit" as const,
      documentId,
      patches: [
        newStatus ? { set: { status: newStatus } } : { unset: ["status"] },
      ],
    }));

    applyActions(actions);
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

export function DocumentActions({
  doc,
  meta,
  table,
}: {
  doc: DocumentHandle;
  meta: TableMeta;
  table: TableType<BookDocument>;
}): ReactElement {
  const data = meta?.documentCache[doc._id];
  const isDraft = data?._id.startsWith("drafts.");
  const selectedRows = table.getSelectedRowModel().rows;
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
      <Button
        icon={PublishIcon}
        disabled={!isDraft}
        tone="primary"
        mode={isDraft ? "default" : "ghost"}
        onClick={() => applyActions(publishActions)}
      />
      <Button
        icon={ResetIcon}
        disabled={!isDraft}
        tone="critical"
        mode={isDraft ? "default" : "ghost"}
        onClick={() => applyActions(discardActions)}
      />
    </Flex>
  );
}

export function DocumentFetcherCell({
  doc,
  meta,
}: {
  doc: DocumentHandle;
  meta: TableMeta;
}) {
  const data = useDocument(doc._id);

  useEffect(() => {
    if (data) {
      const cache = meta?.documentCache;
      if (cache) {
        cache[doc._id] = data;
      }
    }
  }, [data, doc._id, meta]);

  return null;
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
