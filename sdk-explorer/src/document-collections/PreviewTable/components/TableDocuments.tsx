import { useDocuments } from "@sanity/sdk-react/hooks";
import PreviewTable from "../PreviewTable";
import { ToastProvider } from "@sanity/ui";

export function TableDocuments() {
  const { results, isPending, loadMore, hasMore, count } = useDocuments({
    filter: '_type == "book" && defined(releaseDate)',
    sort: [{ field: "releaseDate", direction: "desc" }],
  });

  return (
    <ToastProvider>
      <PreviewTable
        results={results}
        isPending={isPending}
        loadMore={loadMore}
        hasMore={hasMore}
        count={count}
      />
    </ToastProvider>
  );
}
