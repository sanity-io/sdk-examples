import { DocumentHandle } from "@sanity/sdk";
import type { SanityDocument as BaseSanityDocument } from "@sanity/types";
import { UsePreviewResults } from "@sanity/sdk-react/hooks";
import { CardProps } from "@sanity/ui";

export interface SanityDocument extends BaseSanityDocument {
  status?: string;
  releaseDate?: string;
  authors?: Array<{ _ref: string }>;
  firstName?: string;
  lastName?: string;
}

export type PreviewCache = {
  [key: string]: UsePreviewResults["results"] | { isLoading: true };
};

export type DocumentCache = {
  [key: string]: SanityDocument | null;
};

export type TableMeta = {
  documentCache: DocumentCache;
};

export type BookDocument = DocumentHandle & {
  status?: string;
  authors?: Array<{ _ref: string }>;
  releaseDate?: string;
};

export const CARD_TONES: Record<string, CardProps["tone"]> = {
  featured: "critical",
  new: "positive",
  bestseller: "primary",
  "coming-soon": "caution",
};
