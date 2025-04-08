import {Box, Card, Heading, Stack, Text} from '@sanity/ui'
import {type JSX} from 'react'

import ExampleAttributes from './ExampleAttributes'
import ViewCode from './ViewCode'

interface ExampleLayoutProps {
  children: React.ReactNode
  title: string
  codeUrl: string
  hooks: Array<string>
  styling: string
  summary: string
}

/**
 * Layout for example pages
 */
export default function ExampleLayout({
  children,
  title,
  codeUrl,
  hooks,
  styling,
  summary,
}: ExampleLayoutProps): JSX.Element {
  // Scroll to top of view when component loads
  return (
    <Stack space={5}>
      <Heading as="h1" size={5} style={{fontWeight: '500'}}>
        {title}
      </Heading>
      <ExampleAttributes hooks={hooks} styling={styling} />
      <Box>
        <Text muted style={{maxInlineSize: '64ch'}}>
          {summary}
        </Text>
      </Box>
      <Box>
        <ViewCode url={codeUrl} />
      </Box>
      <hr style={{border: 'none', borderTop: '1px solid #ddd'}} />
      <Card padding={4} radius={3} shadow={3}>
        {children}
      </Card>
    </Stack>
  )
}
