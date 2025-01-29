import { Box, Heading, Stack } from '@sanity/ui'
import ExampleAttributes from './ExampleAttributes'
import ViewCode from './ViewCode'

interface ExampleLayoutProps {
  children: React.ReactNode
  title: string
  codeUrl: string
  hooks: Array<string>
  styling: string
}

export default function ExampleLayout({
  children,
  title,
  codeUrl,
  hooks,
  styling,
}: ExampleLayoutProps) {
  return (
    <Stack space={5} padding={4}>
      <Heading as='h1' size={5} style={{ fontWeight: '500' }}>
        {title}
      </Heading>
      <ExampleAttributes hooks={hooks} styling={styling} />
      <Box>
        <ViewCode url={codeUrl} />
      </Box>
      <hr style={{ border: 'none', borderTop: '1px solid #ddd' }} />
      <Box>{children}</Box>
    </Stack>
  )
}
