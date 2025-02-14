import { Badge, Inline, Label, Stack } from "@sanity/ui";

const labelInset = "14ch";

interface ExampleAttributeProps {
  hooks: Array<string>;
  styling: Array<string>;
}

/**
 * Lists the hooks and styling choices for a given example
 */
export default function ExampleAttributes({
  hooks,
  styling,
}: ExampleAttributeProps) {
  return (
    <Stack space={3}>
      <Inline space={3}>
        <Label size={1} style={{ width: labelInset }}>
          Hooks:
        </Label>
        {hooks.map((hook) => (
          <Badge key={hook} padding={2}>
            {hook}
          </Badge>
        ))}
      </Inline>
      <Inline space={3}>
        <Label size={1} style={{ width: labelInset }}>
          Styled with:
        </Label>
        {styling.map((style) => (
          <Badge key={style} padding={2}>
            {style}
          </Badge>
        ))}
      </Inline>
    </Stack>
  );
}
