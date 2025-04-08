import './styles.css'

import {DocumentHandle} from '@sanity/sdk'
import {useDocuments, useProjection} from '@sanity/sdk-react'
import {Spinner} from '@sanity/ui'
import {type JSX, Suspense, useRef} from 'react'

import ExampleLayout from '../../ExampleLayout'

// @todo replace with type from SDK
interface ProjectionResults {
  data: {
    title: string
    cast: string
    posterImage: string
  }
}

// The DocumentPreview component uses the `usePreview` hook to render a document preview interface
function DocumentPreview({document}: {document: DocumentHandle}): JSX.Element {
  // Generate a ref for the outer element
  // This keeps the useProjection hook from resolving if the preview is not currently displayed in the viewport
  const ref = useRef(null)

  // Project the title, first 2 cast members, and poster image values for the document,
  // plus an `isPending` flag to indicate if projection value resolutions are pending
  const {
    data: {title, cast, posterImage},
  }: ProjectionResults = useProjection({
    ...document,
    ref,
    projection: `{
      title,
      'cast': array::join(castMembers[0..1].person->name, ', '),
      'posterImage': poster.asset->url,
    }`,
  })

  return (
    <button
      // Assign the ref to the outer element
      ref={ref}
      className={`
        appearance-none
        text-start
        flex
        flex-col
        p-3
        rounded-sm
        bg-gray-100
        hover:bg-gray-300
      `}
      onClick={() => alert(`Great pick! ${title} is an excellent movie.`)}
    >
      <img
        alt=""
        src={posterImage}
        className="aspect-square w-full rounded-sm bg-gray-100 object-cover xl:aspect-7/8"
        width="400"
        height="400"
      />
      <h3 className="mt-3 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mb-1 text-sm text-gray-600">{cast}</p>
    </button>
  )
}

function PreviewGrid(): JSX.Element {
  // Use the `useDocuments` hook to return an index of document handles for all of our 'movie' type documents
  // Sort the documents by the release date
  const {data: movies} = useDocuments({
    filter: '_type == "movie"',
    orderings: [{field: 'releaseDate', direction: 'desc'}],
  })

  return (
    <ExampleLayout
      title="Preview grid"
      codeUrl="https://github.com/sanity-io/sdk-examples/blob/main/apps/sdk-explorer/src/document-collections/PreviewGrid/PreviewGrid.tsx"
      hooks={['useInfiniteList', 'useProjection']}
      styling="Tailwind"
      summary="This example uses the useInfiniteList hook to retrieve a collection of documents. That collection is then mapped over, with each document passed to a component that uses the useProjection hook to retrieve each document’s title and poster image, and to create a projection of the first three listed cast members. The results are displayed in a grid."
    >
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map((movie) => (
          <Suspense key={movie.documentId} fallback={<Spinner />}>
            <DocumentPreview document={movie} />
          </Suspense>
        ))}
      </div>
    </ExampleLayout>
  )
}

export default PreviewGrid
