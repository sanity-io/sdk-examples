import { DocumentHandle } from '@sanity/sdk'
import { useDocuments, usePreview } from '@sanity/sdk-react/hooks'
import { Button, Card, Flex, Inline, Spinner, Stack, Text } from '@sanity/ui'
import ExampleLayout from '../../ExampleLayout'

function DocumentPreview({ document }: { document: DocumentHandle }) {
  const {
    results: { title, subtitle, media },
    isPending,
  } = usePreview({ document, ref: null })

  if (isPending)
    return (
      <Card padding={4}>
        <Flex align='center' justify='center'>
          <Spinner />
        </Flex>
      </Card>
    )

  return (
    <Button
      mode='bleed'
      onClick={() => alert(`Good choice! ${title} is an excellent book.`)}
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
      codeUrl='https://github.com/sanity-io/sdk-examples'
      hooks={['useDocuments', 'usePreview']}
      styling='Sanity UI'
    >
      <Stack space={4}>
        {books.map((book) => (
          <DocumentPreview key={book._id} document={book} />
        ))}
      </Stack>
    </ExampleLayout>
  )
}

export default PreviewList
