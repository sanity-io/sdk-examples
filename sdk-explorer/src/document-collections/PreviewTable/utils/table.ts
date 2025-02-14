import { SortDirection } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon, DotIcon } from "@sanity/icons";

export function getIcon(isSorted: false | SortDirection) {
  return isSorted === "asc"
    ? ChevronUpIcon
    : isSorted === "desc"
    ? ChevronDownIcon
    : DotIcon;
}
