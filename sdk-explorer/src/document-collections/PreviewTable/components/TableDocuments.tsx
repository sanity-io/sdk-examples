import { useDocuments } from "@sanity/sdk-react/hooks";
import PreviewTable from "../PreviewTable";
import { Suspense } from "react";

export function TableDocuments() {
  const { results, isPending, loadMore, hasMore, count } = useDocuments({
    filter: '_type == "book" && defined(releaseDate)',
    sort: [{ field: "releaseDate", direction: "desc" }],
  });

  // const results = Array.from({ length: 30 }, (_, i) => ({
  //   _id: `book-${i + 1}`,
  //   _type: "book",
  // }));
  // const isPending = false;
  // const loadMore = () => {};
  // const hasMore = false;
  // const count = results.length;

  return (
    <Suspense fallback="loading table">
      <PreviewTable
        results={results}
        isPending={isPending}
        loadMore={loadMore}
        hasMore={hasMore}
        count={count}
      />
    </Suspense>
  );
}
