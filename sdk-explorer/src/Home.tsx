import { Card, Container, Heading, Stack, Text } from '@sanity/ui'
import ExampleCard from './ExampleCard'

export default function Home() {
  return (
    <Container padding={4}>
      <Stack space={5} paddingY={4}>
        <Heading
          as='h1'
          style={{
            fontSize: '4rem',
            fontWeight: 400,
            letterSpacing: '-0.025em',
          }}
        >
          SDK Explorer
        </Heading>
        <Text size={3} muted>
          The Sanity SDK Explorer contains an assortment of examples for each
          component available in the SDK. This copywriting should be more
          exciting!
        </Text>
      </Stack>

      <Stack space={5} paddingY={4}>
        <Card padding={4} radius={2} shadow={3}>
          <Stack space={4}>
            <Text as='h2' size={4} weight='medium'>
              Document collections
            </Text>

            <Stack space={3}>
              <ExampleCard
                to='/document-collections/preview-list'
                title='Preview list'
                description='A list of document previews'
                hooks={['useDocuments', 'usePreview']}
                styling='Sanity UI'
              />
              <ExampleCard
                to='/document-collections/preview-grid'
                title='Preview grid'
                description='A grid of document previews'
                hooks={['useDocuments', 'usePreview']}
                styling='Tailwind'
              />
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}
