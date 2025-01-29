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

function DocumentPreview({ document }: { document: DocumentHandle }) {
  const ref = useRef(null)
  const {
    results: { title, subtitle, media },
    isPending,
  } = usePreview({ document, ref })

  return (
    <Button
      ref={ref}
      mode='bleed'
      onClick={() => alert(`Good choice! ${title} is an excellent book.`)}
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
