import {type DocumentHandle, useDocumentProjection, useDocuments} from '@sanity/sdk-react'
import {Card, Flex, Label, Stack, Text, TextInput} from '@sanity/ui'
import {type JSX, Suspense, useState} from 'react'

import ExampleLayout from '../../../components/ExampleLayout'

interface Projection {
  title: string
  overviewText: string
  imageUrl: string
}

// Component for rendering an item from the `useDocuments` result
function DocumentResult({documentHandle}: {documentHandle: DocumentHandle}) {
  // Use the `useDocumentProjection` hook to get the document’s title, overview text, and poster image URL
  const {
    data: {title, overviewText, imageUrl},
  } = useDocumentProjection<Projection>({
    ...documentHandle,
    projection: `{
      title,
      'overviewText': pt::text(overview),
      'imageUrl': poster.asset->url,
    }`,
  })

  return (
    <Card>
      <Flex gap={4} align="flex-start">
        <img src={imageUrl} alt="" width={64} height={96} />
        <Stack space={4}>
          <Text weight="medium">{title}</Text>
          <Text size={1} muted style={{maxInlineSize: '76ch'}}>
            {overviewText}
          </Text>
        </Stack>
      </Flex>
    </Card>
  )
}

export default function DocumentSearch(): JSX.Element {
  // Create a state variable for keeping track of the search input’s value
  const [search, setSearch] = useState('')

  const {data: movies, count} = useDocuments({
    documentType: 'movie',
    // Pass the `search` state variable to the `useDocuments` hook’s `search` parameter
    search,
  })

  function EmptyState() {
    return (
      <Card tone="primary" radius={2} shadow={1} padding={4}>
        Start typing in the input above to search for movies
      </Card>
    )
  }

  function NoResults() {
    return (
      <Card tone="caution" radius={2} shadow={1} padding={4}>
        We couldn’t find any movies with content matching the search term ‘{search}’. Try something
        else?
      </Card>
    )
  }

  function Results() {
    return movies.map((movie) => (
      <Suspense key={movie.documentId}>
        <DocumentResult documentHandle={movie} />
      </Suspense>
    ))
  }

  let Component

  if (search === '') {
    Component = EmptyState
  } else if (count === 0) {
    Component = NoResults
  } else Component = Results

  return (
    <ExampleLayout
      title="Document search"
      hooks={['useDocuments', 'useDocumentProjection']}
      codeUrl="https://github.com/sanity-io/sdk-examples/blob/main/apps/sdk-explorer/src/examples/document-collections/DocumentSearch/DocumentSearch.tsx"
      styling="Sanity UI"
      summary="This example passes a state variable to the useDocuments hook’s ‘search’ argument, enabling the creation of a dynamic search interface for documents in the targeted dataset(s). (Note: the ‘search’ parameter currently searches for matches across all of a document’s string fields.)"
    >
      <Stack space={5} marginBottom={4}>
        <Stack space={3}>
          <Label htmlFor="movieSearch">Enter your search term:</Label>
          {/* Use a search input to set the value of the `search` state variable */}
          <TextInput
            id="movieSearch"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            padding={4}
            type="search"
            placeholder="Start typing"
          />
        </Stack>

        <Component />
      </Stack>
    </ExampleLayout>
  )
}
