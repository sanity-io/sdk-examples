import './styles.css'

import {DocumentHandle, usePaginatedList, useProjection} from '@sanity/sdk-react'
import {type JSX, useRef} from 'react'

import ExampleLayout from '../../ExampleLayout'

interface MovieProjectionResults {
  results: {
    title: string
    posterImage: string
    cast: string
    releaseDate: string
    popularity: number
  }
}

function DocumentRow({document, index}: {document: DocumentHandle; index: number}) {
  const ref = useRef(null)

  const {
    results: {title, posterImage, cast, popularity, releaseDate},
  }: MovieProjectionResults = useProjection({
    document,
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
    <tr ref={ref} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
      <td className="p-2">
        <img
          width={64}
          src={posterImage}
          alt={`Poster for ${title}`}
          className="border-4 border-solid border-white shadow-sm"
        />
      </td>
      <td className="p-2">{title}</td>
      <td className="p-2">{cast}</td>
      <td className="p-2">{Math.round(popularity)}</td>
      <td className="p-2">{new Date(releaseDate).toLocaleDateString()}</td>
    </tr>
  )
}

export default function DocumentTable(): JSX.Element {
  const {data, currentPage, totalPages, nextPage, previousPage, hasNextPage, hasPreviousPage} =
    usePaginatedList({
      filter: '_type == "movie"',
      pageSize: 6,
      orderings: [{field: 'releaseDate', direction: 'desc'}],
    })

  return (
    <ExampleLayout
      title="Document table"
      codeUrl="https://github.com/sanity-io/sdk-examples/blob/main/sdk-explorer/src/document-collections/DocumentTable/DocumentTable.tsx"
      hooks={['usePaginatedList', 'useProjection']}
      styling="Tailwind"
    >
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left px-2 py-4">Poster</th>
            <th className="text-left px-2 py-4">Title</th>
            <th className="text-left px-2 py-4">Cast</th>
            <th className="text-left px-2 py-4">Popularity</th>
            <th className="text-left px-2 py-4">Release Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((document, index) => (
            <DocumentRow key={document._id} document={document} index={index} />
          ))}
        </tbody>
      </table>

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
