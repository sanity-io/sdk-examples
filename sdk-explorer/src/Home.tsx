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
        <Stack space={5}>
          <Text size={3} muted>
            The Sanity App SDK Explorer contains an assortment of example
            interfaces built with our React SDK’s hooks. The purpose of the
            Explorer is to demonstrate how these hooks can be used to build out
            interfaces powered by Sanity, with a variety of approaches to
            styling.
          </Text>
          <Text size={3} muted>
            Each example contains an interface rendered in the browser as well
            as a link to the example’s code on GitHub to demonstrate how the
            example is built. Example code is enriched with comments and may
            freely be used in your own applications.
          </Text>
        </Stack>
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

        <Card padding={4} radius={2} shadow={3}>
          <Stack space={4}>
            <Text as='h2' size={4} weight='medium'>
              Users
            </Text>

            <Stack space={3}>
              <ExampleCard
                to='/users/user-profile'
                title='User profile'
                description='Information about the currently authenticated user'
                hooks={['useAuthState', 'useCurrentUser']}
                styling='Sanity UI'
              />
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}
