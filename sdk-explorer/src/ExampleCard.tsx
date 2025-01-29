import { hues } from '@sanity/color'
import { Card, Stack, Text } from '@sanity/ui'
import { Link } from 'react-router'
import ExampleAttributes from './ExampleAttributes'

interface ExampleCardProps {
  description: string
  hooks: Array<string>
  styling: string
  title: string
  to: string
}

/**
 * Shows a summary of an example on the Home page
 */
export default function ExampleCard({
  title,
  description,
  hooks,
  styling,
  to,
}: ExampleCardProps) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Card tone='neutral' paddingX={3} paddingY={4} radius={3}>
        <Stack space={4}>
          <Text
            as='h3'
            size={3}
            weight='medium'
            style={{ color: hues.red['500'].hex }}
          >
            {title}
          </Text>
          <Text size={1}>{description}</Text>
          <ExampleAttributes hooks={hooks} styling={styling} />
        </Stack>
      </Card>
    </Link>
  )
}
