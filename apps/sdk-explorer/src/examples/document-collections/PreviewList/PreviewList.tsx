import {DocumentHandle} from '@sanity/sdk'
import {useDocuments, useProjection} from '@sanity/sdk-react'
import {Button, Card, Flex, Inline, Spinner, Stack, Text} from '@sanity/ui'
import {type JSX, Suspense, useRef} from 'react'

import ExampleLayout from '../../../components/ExampleLayout'
import {documents, projection} from '../../../components/Hooks'

function Loading() {
  return (
    <Card padding={4}>
      <Flex align="center" justify="center">
        <Spinner />
      </Flex>
    </Card>
  )
}

// @todo replace with type from SDK
interface ProjectionResults {
  data: {
    title: string
    cast: string
    posterImage: string
  }
}

// The DocumentPreview component uses the `usePreview` hook to render a document preview interface
function DocumentPreview({document}: {document: DocumentHandle}) {
  // Generate a ref for the outer element
  // This keeps the useProjection hook from firing if the preview is not currently displayed in the viewport
  const ref = useRef(null)

  // Project the title, first 3 cast mambers, and post image values for the document,
  // plus an `isPending` flag to indicate if projection value resolutions are pending
  const {
    data: {title, cast, posterImage},
  }: ProjectionResults = useProjection({
    ...document,
    ref,
    projection: `{
      title,
      'cast': array::join(castMembers[0..2].person->name, ', '),
      'posterImage': poster.asset->url,
    }`,
  })

  return (
    <Button
      // Assign the ref to the outer element
      ref={ref}
      mode="bleed"
      onClick={() => alert(`Good choice! ${title} is an excellent movie.`)}
    >
      <Inline space={4}>
        <img src={posterImage} alt="" width="96" height="144" />
        <Stack space={3}>
          <Text as="h2" weight="medium" size={2}>
            {title}
          </Text>
          <Text size={2} muted>
            {cast}
          </Text>
        </Stack>
      </Inline>
    </Button>
  )
}

function PreviewList(): JSX.Element {
  // Use the `useDocuments` hook to return an index of document handles for all of our 'movie' type documents
  // Sort the documents by the the release date
  const {data: movies} = useDocuments({
    filter: '_type == "movie"',
    orderings: [{field: 'releaseDate', direction: 'desc'}],
  })

  return (
    <ExampleLayout
      title="Preview list"
      codeUrl="https://github.com/sanity-io/sdk-examples/blob/main/apps/sdk-explorer/src/examples/document-collections/PreviewList/PreviewList.tsx"
      hooks={[documents, projection]}
      styling="Sanity UI"
      summary="This example uses the useDocuments hook to retrieve a collection of documents. That collection is then mapped over, with each document passed to a component that uses the useProjection hook to retrieve each document’s title and poster image, and to create a projection of the first three listed cast members."
    >
      <Stack style={{overflowY: 'scroll'}}>
        {movies.map((movie) => (
          <Suspense key={movie.documentId} fallback={<Loading />}>
            <DocumentPreview document={movie} />
          </Suspense>
        ))}
      </Stack>
    </ExampleLayout>
  )
}

export default PreviewList
