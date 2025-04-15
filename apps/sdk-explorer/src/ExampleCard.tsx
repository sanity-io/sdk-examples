import {hues} from '@sanity/color'
import {Card, Inline, Stack, Text} from '@sanity/ui'
import {type JSX} from 'react'
import {Link} from 'react-router'

import ExampleAttributes from './ExampleAttributes'

interface ExampleCardProps {
  description: string
  hooks: Array<string>
  img: string
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
  img,
  styling,
  to,
}: ExampleCardProps): JSX.Element {
  return (
    <Link to={to} style={{textDecoration: 'none'}}>
      <Card shadow={2} paddingX={2} paddingY={3} radius={3}>
        <Inline>
          <div
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'fit',
              backgroundRepeat: 'no-repeat',
              maskImage: 'linear-gradient(to bottom right, white, transparent)',
              maskMode: 'alpha',
              width: 200,
              height: 200,
              display: 'inline-block',
            }}
          />
          <Stack space={4} style={{marginLeft: '2rem'}}>
            <Text as="h3" size={3} weight="medium" style={{color: hues.blue['500'].hex}}>
              {title}
            </Text>
            <Text size={1} muted>
              {description}
            </Text>
            <ExampleAttributes hooks={hooks} styling={styling} />
          </Stack>
        </Inline>
      </Card>
    </Link>
  )
}
