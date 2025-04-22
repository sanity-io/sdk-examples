import {Badge, Box, Inline} from '@sanity/ui'
import {type JSX} from 'react'

export interface HookReference {
  name: 'useDocuments' | 'usePaginatedDocuments' | 'useProjection' | 'useQuery'
  reference: `https://${string}`
}

// These consts can't begin with the word `use` or eslint yells at you for
// passing around a 'hook' reference

const documents: HookReference = {
  name: 'useDocuments',
  reference: 'https://sdk-docs.sanity.dev/functions/sdk-react.index.useDocuments.html',
}

const paginatedDocuments: HookReference = {
  name: 'usePaginatedDocuments',
  reference: 'https://sdk-docs.sanity.dev/functions/sdk-react.index.usePaginatedDocuments.html',
}

const projection: HookReference = {
  name: 'useProjection',
  reference: 'https://sdk-docs.sanity.dev/functions/sdk-react.index.useProjection.html',
}

const query: HookReference = {
  name: 'useQuery',
  reference: 'https://sdk-docs.sanity.dev/functions/sdk-react.index.useQuery.html',
}

export {documents, paginatedDocuments, projection, query}

interface HooksProps {
  hooks: HookReference[]
}

export default function Hooks({hooks}: HooksProps): JSX.Element {
  return (
    <Inline space={3}>
      {hooks.map((hook) => (
        <Badge key={hook.name} tone="primary">
          <a href={hook.reference} style={{display: 'inline-block'}}>
            <Box as="span" padding={1}>
              {hook.name}
            </Box>
          </a>
        </Badge>
      ))}
    </Inline>
  )
}
