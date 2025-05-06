import {Badge, Box, Inline} from '@sanity/ui'
import {type JSX} from 'react'

const baseUrl = 'https://reference.sanity.dev/_sanity/sdk-react/exports/'

// Just update this array with a hook name to add a ReferenceLink for it
const hookNames = ['useDocuments', 'usePaginatedDocuments', 'useProjection', 'useQuery'] as const

type HookName = (typeof hookNames)[number]

type ReferenceLink = {
  [key in HookName]: string
}

const referenceLinks = hookNames.reduce(
  (allHooks, current) => ({...allHooks, [current]: `${baseUrl}${current}`}),
  {} as ReferenceLink,
)

export interface HooksProps {
  hooks: HookName[]
}

export default function Hooks({hooks}: HooksProps): JSX.Element {
  return (
    <Inline space={3}>
      {hooks.map((hook) => (
        <Badge key={hook} tone="primary">
          <a href={referenceLinks[hook]} style={{display: 'inline-block'}}>
            <Box as="span" padding={1}>
              {hook}
            </Box>
          </a>
        </Badge>
      ))}
    </Inline>
  )
}
