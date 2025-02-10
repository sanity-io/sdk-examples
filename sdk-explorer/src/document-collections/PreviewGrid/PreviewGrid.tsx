import { DocumentHandle } from '@sanity/sdk'
import { useDocuments, usePreview } from '@sanity/sdk-react/hooks'
import { Spinner } from '@sanity/ui'
import { Suspense, useRef } from 'react'
import ExampleLayout from '../../ExampleLayout'
import './styles.css'

// The DocumentPreview component uses the `usePreview` hook to render a document preview interface
function DocumentPreview({ document }: { document: DocumentHandle }) {
  // Generate a ref for the outer element
  // This keeps the usePreview hook from resolving if the preview is not currently displayed in the viewport
  const ref = useRef(null)

  // Get the preview's title, subtitle, and media fields,
  // plus an `isPending` flag to indicate if preview value resolutions are pending
  const {
    results: { title, subtitle, media },
    isPending,
  } = usePreview({ document, ref })

  return (
    <button
      // Assign the ref to the outer element
      ref={ref}
      // When preview values are resolving, we’ll lower the opacity to indicate this state visually
      className={`group appearance-none text-start p-3 rounded-md border-1 border-gray-100 shadow-xl ${isPending ? 'opacity-50' : 'opacity-100'}`}
      onClick={() => alert(`Great pick! ${title} is an excellent book.`)}
    >
      <img
        alt=''
        src={media?.url}
        className='aspect-square w-full rounded-sm bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8'
        style={{ width: 400 }}
      />
      <h3 className='mt-3 text-xl font-medium text-gray-900'>{title}</h3>
      <p className='mb-1 text-md text-gray-600'>{subtitle}</p>
    </button>
  )
}

function PreviewGrid() {
  // Use the `useDocuments` hook to return an index of document handles for all of our 'book' type documents
  // Sort the documents by the author's last name, then the release date
  const { results: books, isPending } = useDocuments({
    filter: '_type == "book"',
    sort: [
      { field: 'authors[0]->lastName', direction: 'asc' },
      { field: 'releaseDate', direction: 'asc' },
    ],
  })

  if (isPending) {
    return <div className='p-4 flex items-center content-center'>Loading…</div>
  }

  return (
    <ExampleLayout
      title='Preview grid'
      codeUrl='https://github.com/sanity-io/sdk-examples/blob/main/sdk-explorer/src/document-collections/PreviewGrid/PreviewGrid.tsx'
      hooks={['useDocuments', 'usePreview']}
      styling='Tailwind'
    >
      <div className='grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
        {books.map((book) => (
          <Suspense key={book._id} fallback={<Spinner />}>
            <DocumentPreview key={book._id} document={book} />
          </Suspense>
        ))}
      </div>
    </ExampleLayout>
  )
}

export default PreviewGrid
