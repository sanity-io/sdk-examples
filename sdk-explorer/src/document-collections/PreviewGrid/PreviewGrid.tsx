import { DocumentHandle } from '@sanity/sdk'
import { useDocuments, usePreview } from '@sanity/sdk-react/hooks'
import ExampleLayout from '../../ExampleLayout'
import './styles.css'

function DocumentPreview({ document }: { document: DocumentHandle }) {
  const {
    results: { title, subtitle, media },
    isPending,
  } = usePreview({ document, ref: null })

  if (isPending)
    return <div className='p-4 flex items-center content-center'>Loading…</div>

  return (
    <button
      className='group appearance-none text-start p-3 rounded-md border-1 border-gray-100 shadow-xl'
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
      codeUrl='https://github.com/sanity-io/sdk-examples'
      hooks={['useDocuments', 'usePreview']}
      styling='Tailwind'
    >
      <div className='grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
        {books.map((book) => (
          <DocumentPreview key={book._id} document={book} />
        ))}
      </div>
    </ExampleLayout>
  )
}

export default PreviewGrid
