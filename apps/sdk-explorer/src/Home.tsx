import {Box, Card, Heading, Stack, Text} from '@sanity/ui'
import {type JSX} from 'react'

import ExampleCard from './ExampleCard'

export default function Home(): JSX.Element {
  return (
    <Box>
      <Stack space={5} paddingY={4}>
        <Heading
          as="h1"
          style={{
            fontSize: '4rem',
            fontWeight: 400,
            letterSpacing: '-0.025em',
          }}
        >
          SDK Explorer
        </Heading>
        <Stack space={5}>
          <Text size={3} muted>
            The Sanity App SDK Explorer contains an assortment of example interfaces built with our
            React SDK’s hooks. The purpose of the Explorer is to demonstrate how these hooks can be
            used to build out interfaces powered by Sanity, with a variety of approaches to styling.
          </Text>
          <Text size={3} muted>
            Each example contains an interface rendered in the browser as well as a link to the
            example’s code on GitHub to demonstrate how the example is built. Example code is
            enriched with comments and may freely be used in your own applications.
          </Text>
        </Stack>
      </Stack>

      <Stack space={5} paddingY={4}>
        <Card padding={4} radius={2} shadow={3}>
          <Stack space={4}>
            <Text as="h2" size={4} weight="medium">
              Document collections
            </Text>

            <Stack space={3}>
              <ExampleCard
                to="/document-collections/document-table"
                title="Document table"
                description="A tabular rendering of documents and their content"
                hooks={['usePaginatedList', 'useProjection']}
                styling="Tailwind"
              />
              <ExampleCard
                to="/document-collections/preview-list"
                title="Preview list"
                description="A list of document previews"
                hooks={['useInfiniteList', 'useProjection']}
                styling="Sanity UI"
              />
              <ExampleCard
                to="/document-collections/preview-grid"
                title="Preview grid"
                description="A grid of document previews"
                hooks={['useInfiniteList', 'useProjection']}
                styling="Tailwind"
              />
            </Stack>
          </Stack>
        </Card>
      </Stack>

      <Stack space={5} paddingY={4}>
        <Card padding={4} radius={2} shadow={3}>
          <Stack space={4}>
            <Text as="h2" size={4} weight="medium">
              GROQ
            </Text>

            <Stack space={3}>
              <ExampleCard
                to="/groq/movies-by-actor"
                title="Movies by actor"
                description="Use multiple useQuery hooks to fetch and filter data"
                hooks={['useQuery']}
                styling="Sanity UI"
              />
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  )
}
