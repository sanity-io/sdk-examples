import './styles.css'

import {type DocumentHandle, useDocumentProjection, usePaginatedDocuments} from '@sanity/sdk-react'
import {type JSX, useRef} from 'react'

import ExampleLayout from '../../../components/ExampleLayout'

interface MovieProjectionResults {
  data: {
    title: string
    posterImage: string
    cast: string
    releaseDate: string
    popularity: number
  }
}

function DocumentRow({document}: {document: DocumentHandle}) {
  const ref = useRef(null)

  const {
    data: {title, posterImage, cast, popularity, releaseDate},
  }: MovieProjectionResults = useDocumentProjection({
    ...document,
    ref,
    // In our projection, we will:
    // 1. Get the title of the movie
    // 2. Get the poster image URL of the movie by dereferencing the poster asset
    // 3. Get the names of the first 3 cast members by dereferencing the castMembers array and joining them to a string
    // 4. Get the popularity of the movie
    // 5. Get the release date of the movie
    projection: `{
      title,
      'posterImage': poster.asset->url,
      'cast': array::join(castMembers[0..2].person->name, ', '),
      popularity,
      releaseDate
    }`,
  })

  return (
    <tr ref={ref} className="border-solid border-b border-gray-200">
      <td className="p-2">
        <img width={64} src={posterImage} alt={`Poster for ${title}`} className="shadow-sm" />
      </td>
      <td className="p-2 font-medium">{title}</td>
      <td className="p-2 text-gray-600">{cast}</td>
      <td className="p-2 text-gray-600">{Math.round(popularity)}</td>
      <td className="p-2 text-gray-600">{new Date(releaseDate).toLocaleDateString()}</td>
    </tr>
  )
}

export default function DocumentTable(): JSX.Element {
  const {data, currentPage, totalPages, nextPage, previousPage, hasNextPage, hasPreviousPage} =
    usePaginatedDocuments({
      documentType: 'movie',
      pageSize: 6,
      orderings: [{field: 'releaseDate', direction: 'desc'}],
    })

  return (
    <ExampleLayout
      title="Document table"
      codeUrl="https://github.com/sanity-io/sdk-examples/blob/main/apps/sdk-explorer/src/examples/document-collections/DocumentTable/DocumentTable.tsx"
      hooks={['usePaginatedDocuments', 'useDocumentProjection']}
      styling="Tailwind"
      summary="This example uses the usePaginatedDocuments hook to retrieve a paginated collection of documents with six items per page, in addition to state and functions to control the pagination. The useDocumentProjection hook is used to retrieve contents and create projections from each document. Each document and its content and projections are then rendered in a table row."
    >
      <div className="overflow-x-scroll">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-solid border-b-2 border-gray-200">
              <th className="text-left text-xs uppercase font-semibold text-gray-600 px-2 py-4">
                Poster
              </th>
              <th className="text-left text-xs uppercase font-semibold text-gray-600 px-2 py-4">
                Title
              </th>
              <th className="text-left text-xs uppercase font-semibold text-gray-600 px-2 py-4">
                Cast
              </th>
              <th className="text-left text-xs uppercase font-semibold text-gray-600 px-2 py-4">
                Popularity
              </th>
              <th className="text-left text-xs uppercase font-semibold text-gray-600 px-2 py-4">
                Release Date
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((document) => (
              <DocumentRow key={document.documentId} document={document} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Table navigation */}
      <nav className="flex justify-between items-center my-8">
        <button
          className={`rounded-sm px-4 py-2 bg-blue-500 text-white font-medium transition ${!hasPreviousPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          onClick={previousPage}
          disabled={!hasPreviousPage}
        >
          Previous Page
        </button>
        <div className="font-medium">
          Page {currentPage}/{totalPages}
        </div>
        <button
          className={`rounded-sm px-4 py-2 bg-blue-500 text-white font-medium transition ${!hasNextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          onClick={nextPage}
          disabled={!hasNextPage}
        >
          Next Page
        </button>
      </nav>
    </ExampleLayout>
  )
}
