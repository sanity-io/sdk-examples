import { Card, Flex, Radio, Text } from "@sanity/ui";
import { FilterFn } from "@tanstack/react-table";
import { BookDocument } from "../types";

interface StatusFilterProps {
  value: FilterFn<BookDocument>;
  onChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  { id: "all", value: "", label: "All statuses" },
  { id: "featured", value: "featured", label: "Featured" },
  { id: "new", value: "new", label: "New" },
  { id: "bestseller", value: "bestseller", label: "Bestseller" },
  { id: "coming-soon", value: "coming-soon", label: "Coming Soon" },
] as const;

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <Card padding={3}>
      <Flex gap={3} align="center">
        <Text size={1} weight="medium">
          Status:
        </Text>
        <Flex gap={3} wrap="wrap" align="center">
          {STATUS_OPTIONS.map((option) => (
            <Flex key={option.id} gap={2} align="center">
              <Radio
                id={`status-${option.id}`}
                checked={value === option.value}
                name="status"
                value={option.value}
                onChange={(e) => onChange(e.currentTarget.value)}
              />
              <Text as="label" htmlFor={`status-${option.id}`} size={1}>
                {option.label}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Card>
  );
}
