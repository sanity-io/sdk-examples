import {DocumentHandle, useDocuments, useProjection} from '@sanity/sdk-react'
import {Card, Flex, Label, Stack, Text, TextInput} from '@sanity/ui'
import {type JSX, Suspense, useState} from 'react'

import ExampleLayout from '../../../components/ExampleLayout'
import {documents, projection} from '../../../components/Hooks'

interface Projection {
  title: string
  overviewText: string
  imageUrl: string
}

// Component for rendering an item from the `useDocuments` result
function DocumentResult({documentHandle}: {documentHandle: DocumentHandle}) {
  // Use the `useProjection` hook to get the document’s title, overview text, and poster image URL
  const {
    data: {title, overviewText, imageUrl},
  } = useProjection<Projection>({
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

  const {data: movies} = useDocuments({
    filter: '_type == "movie"',
    // Pass the `search` state variable to the `useDocuments` hook’s `search` parameter
    search,
  })

  return (
    <ExampleLayout
      title="Document search"
      hooks={[documents, projection]}
      codeUrl="https://github.com/sanity-io/sdk-examples/blob/main/apps/sdk-explorer/src/examples/document-collections/DocumentSearch/DocumentSearch.tsx"
      styling="Sanity UI"
      summary="This example passes a state variable to the useDocuments hook’s ‘search’ argument, enabling the creation of a dynamic search interface for documents in the targeted dataset(s). (Note: the ‘search’ parameter currently searches for matches across all of a document’s string fields.)"
    >
      <Stack space={5}>
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

        {search === ''
          ? ''
          : movies.map((movie) => (
              <Suspense key={movie.documentId}>
                <DocumentResult documentHandle={movie} />
              </Suspense>
            ))}
      </Stack>
    </ExampleLayout>
  )
}
