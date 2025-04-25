import {LaunchIcon} from '@sanity/icons'
import {Badge, Box, Inline, Label, Stack} from '@sanity/ui'
import {type JSX} from 'react'

import Hooks, {type HooksProps} from './Hooks'

const labelInset = '14ch'

export type ExampleAttributeProps = HooksProps & {
  styling: 'Sanity UI' | 'Tailwind'
}

const stylingLinks = {
  'Sanity UI': 'https://sanity.io/ui',
  'Tailwind': 'https://tailwindcss.com',
}

/**
 * Lists the hooks and styling choices for a given example
 */
export default function ExampleAttributes({hooks, styling}: ExampleAttributeProps): JSX.Element {
  return (
    <Stack space={3}>
      <Inline space={3}>
        <Label size={1} style={{width: labelInset}}>
          Hooks:
        </Label>
        <Hooks hooks={hooks} />
      </Inline>
      <Inline space={3}>
        <Label size={1} style={{width: labelInset}}>
          Styled with:
        </Label>
        <Badge tone="primary">
          <a href={stylingLinks[styling]} style={{display: 'inline-block'}}>
            <Box padding={1}>
              {styling}
              <Box display="inline-block" paddingLeft={2} paddingRight={1}>
                <LaunchIcon />
              </Box>
            </Box>
          </a>
        </Badge>
      </Inline>
    </Stack>
  )
}
