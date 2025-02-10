import { DocumentHandle } from '@sanity/sdk'
import { useDocuments, usePreview } from '@sanity/sdk-react/hooks'
import { Button, Card, Flex, Inline, Spinner, Stack, Text } from '@sanity/ui'
import { Suspense, useRef } from 'react'
import ExampleLayout from '../../ExampleLayout'

function Loading() {
  return (
    <Card padding={4}>
      <Flex align='center' justify='center'>
        <Spinner />
      </Flex>
    </Card>
  )
}

// The DocumentPreview component uses the `usePreview` hook to render a document preview interface
function DocumentPreview({ document }: { document: DocumentHandle }) {
  // Generate a ref for the outer element
  // This keeps the usePreview hook from resolving if the preview is not currently displayed in the viewport
  const ref = useRef(null)

  // Get the preview's title, subtitle, and media fields,
  // plus an `isPending` flag to indicate if preview value resolutions are pending
  const {
    results: { title, subtitle, media },
    isPending,
  } = usePreview({ document, ref })

  return (
    <Button
      // Assign the ref to the outer element
      ref={ref}
      mode='bleed'
      onClick={() => alert(`Good choice! ${title} is an excellent book.`)}
      // When preview values are resolving, we’ll lower the opacity to indicate this state visually
      style={{ opacity: isPending ? 0.5 : 1 }}
    >
      <Inline space={4}>
        {media?.type === 'image-asset' && (
          <Card tone='transparent' shadow={2}>
            <img src={media.url} alt='' width='128' />
          </Card>
        )}
        <Stack space={3}>
          <Text as='h2' weight='medium' size={4}>
            {title}
          </Text>
          <Text size={2}>{subtitle}</Text>
        </Stack>
      </Inline>
    </Button>
  )
}

function PreviewList() {
  // Use the `useDocuments` hook to return an index of document handles for all of our 'book' type documents
  // Sort the documents by the author's last name, then the release date
  const { results: books, isPending } = useDocuments({
    filter: '_type == "book"',
    sort: [
      { field: 'authors[0]->lastName', direction: 'asc' },
      { field: 'releaseDate', direction: 'asc' },
    ],
  })

  if (isPending) {
    return (
      <Flex align='center' justify='center' padding={5}>
        <Spinner />
      </Flex>
    )
  }

  return (
    <ExampleLayout
      title='Preview list'
      codeUrl='https://github.com/sanity-io/sdk-examples/blob/main/sdk-explorer/src/document-collections/PreviewList/PreviewList.tsx'
      hooks={['useDocuments', 'usePreview']}
      styling='Sanity UI'
    >
      <Stack space={4}>
        {books.map((book) => (
          <Suspense key={book._id} fallback={<Loading />}>
            <DocumentPreview key={book._id} document={book} />
          </Suspense>
        ))}
      </Stack>
    </ExampleLayout>
  )
}

export default PreviewList
