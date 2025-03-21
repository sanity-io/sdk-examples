import {
  DocumentHandle,
  usePaginatedList,
  useProjection,
} from '@sanity/sdk-react'
import { useRef } from 'react'
import ExampleLayout from '../../ExampleLayout'
import './styles.css'

interface BookProjectionResults {
  results: {
    title: string
    coverImage: string
    authorNames: string
    publisherName: string
    releaseDate: string
  }
}

function DocumentRow({
  document,
  index,
}: {
  document: DocumentHandle
  index: number
}) {
  const ref = useRef(null)

  const {
    results: { title, coverImage, authorNames, publisherName, releaseDate },
  }: BookProjectionResults = useProjection({
    document,
    ref,
    // In our projection, we will:
    // 1. Get the title of the book
    // 2. Get the cover image URL of the book by dereferencing the cover asset
    // 3. Get the names of the authors of the book by dereferencing the author assets and joining them to a string
    // 4. Get the name of the publisher of the book by dereferencing the publisher field and returning the name
    // 5. Get the release date of the book
    projection: `{
      title,
      'coverImage': cover.asset->url,
      'authorNames': array::join(authors[]->{'name': firstName + ' ' + lastName}.name, ', '),
      'publisherName': publisher->name,
      releaseDate
    }`,
  })

  return (
    <tr ref={ref} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
      <td className='p-2'>
        <img
          width={64}
          src={coverImage}
          alt={`Cover for ${title}`}
          className='border-4 border-solid border-white shadow-sm'
        />
      </td>
      <td className='p-2'>{title}</td>
      <td className='p-2'>{authorNames}</td>
      <td className='p-2'>{publisherName}</td>
      <td className='p-2'>{releaseDate}</td>
    </tr>
  )
}

export default function DocumentTable() {
  const {
    data,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
  } = usePaginatedList({
    filter: '_type == "book"',
    pageSize: 10,
  })

  return (
    <ExampleLayout
      title='Document table'
      codeUrl='https://github.com/sanity-io/sdk-examples/blob/main/sdk-explorer/src/document-collections/PreviewGrid/PreviewGrid.tsx'
      hooks={['usePaginatedList', 'useProjection']}
      styling='Tailwind'
    >
      <table className='w-full'>
        <thead>
          <tr>
            <th className='text-left px-2 py-4'>Cover</th>
            <th className='text-left px-2 py-4'>Title</th>
            <th className='text-left px-2 py-4'>Authors</th>
            <th className='text-left px-2 py-4'>Publisher</th>
            <th className='text-left px-2 py-4'>Release Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((document, index) => (
            <DocumentRow key={document._id} document={document} index={index} />
          ))}
        </tbody>
      </table>

      {/* Table navigation */}
      <nav className='flex justify-between items-center my-8'>
        <button
          className='rounded-sm px-4 py-2 bg-blue-500 text-white font-medium hover:bg-blue-700 transition'
          onClick={previousPage}
          disabled={!hasPreviousPage}
        >
          Previous Page
        </button>
        <div className='font-medium'>
          Page {currentPage}/{totalPages}
        </div>
        <button
          className='rounded-sm px-4 py-2 bg-blue-500 text-white font-medium hover:bg-blue-700 transition'
          onClick={nextPage}
          disabled={!hasNextPage}
        >
          Next Page
        </button>
      </nav>
    </ExampleLayout>
  )
}
