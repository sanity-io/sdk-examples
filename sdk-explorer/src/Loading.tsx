import { Flex, Spinner } from "@sanity/ui";

export function Loading() {
  return (
    <Flex
      align="center"
      justify="center"
      style={{ inlineSize: "100dvw", blockSize: "100dvh" }}
    >
      <Spinner />
    </Flex>
  );
}
