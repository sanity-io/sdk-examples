import {hues} from '@sanity/color'
import {Box, Card, Stack, Text} from '@sanity/ui'
import {type JSX} from 'react'
import {Link} from 'react-router'
import styled from 'styled-components'

import ExampleAttributes, {type ExampleAttributeProps} from './ExampleAttributes'

type ExampleCardProps = ExampleAttributeProps & {
  description: string
  img: string
  title: string
  to: string
}

const StyledLink = styled(Link)`
  &:after {
    content: '';
    position: absolute;
    inset: 0;
  }
`

const CardGrid = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 1rem;

  @media (width >= 600px) {
    grid-template-columns: minmax(50px, 0.25fr) 1fr;
  }
`

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
    <Card shadow={2} paddingX={3} paddingY={4} radius={3} style={{position: 'relative'}}>
      <CardGrid>
        <Box
          display={['none', 'none', 'inline-block']}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            maskImage: 'linear-gradient(to bottom right, white, transparent)',
            maskMode: 'alpha',
            aspectRatio: 1,
          }}
        />
        <Stack space={4}>
          <StyledLink to={to} style={{textDecoration: 'none'}}>
            <Text as="h3" size={3} weight="medium" style={{color: hues.blue['500'].hex}}>
              {title}
            </Text>
          </StyledLink>
          <Text size={1} muted>
            {description}
          </Text>
          <ExampleAttributes hooks={hooks} styling={styling} />
        </Stack>
      </CardGrid>
    </Card>
  )
}
