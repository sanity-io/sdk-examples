import {Badge, Box, Inline} from '@sanity/ui'
import {type JSX} from 'react'

const baseUrl = 'https://sdk-docs.sanity.dev/functions/React_SDK.exports.'

const referenceLinks = {
  useDocuments: `${baseUrl}useDocuments.html`,
  usePaginatedDocuments: `${baseUrl}usePaginatedDocuments.html`,
  useProjection: `${baseUrl}useProjection.html`,
  useQuery: `${baseUrl}useQuery.html`,
}

interface HookReference {
  name: 'useDocuments' | 'usePaginatedDocuments' | 'useProjection' | 'useQuery'
  reference: (typeof referenceLinks)[keyof typeof referenceLinks]
}

// These consts can't begin with the word `use` or eslint yells at you for
// passing around a 'hook' reference

const documents: HookReference = {
  name: 'useDocuments',
  reference: referenceLinks.useDocuments,
}

const paginatedDocuments: HookReference = {
  name: 'usePaginatedDocuments',
  reference: referenceLinks.usePaginatedDocuments,
}

const projection: HookReference = {
  name: 'useProjection',
  reference: referenceLinks.useProjection,
}

const query: HookReference = {
  name: 'useQuery',
  reference: referenceLinks.useQuery,
}

export {documents, paginatedDocuments, projection, query}

export interface HooksProps {
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
