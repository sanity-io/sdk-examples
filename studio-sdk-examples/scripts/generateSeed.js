const fs = require('fs')
const path = require('path')
const https = require('https')

// Helper function to make HTTP requests
const fetch = (url) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => resolve(JSON.parse(data)))
      })
      .on('error', reject)
  })
}

// Helper to generate a random status
const getRandomStatus = () => {
  const statuses = ['featured', 'bestseller', 'new']
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// Helper to generate a publisher
const generatePublisher = (id, name) => {
  return {
    _id: `publisher-${id}`,
    _type: 'publisher',
    name,
  }
}

// Helper to generate an author
const generateAuthor = (id, name) => {
  const [firstName, ...lastNameParts] = name.split(' ')
  return {
    _id: `author-${id}`,
    _type: 'author',
    firstName,
    lastName: lastNameParts.join(' '),
  }
}

async function main() {
  try {
    // Fetch trending books from Open Library
    const response = await fetch('https://openlibrary.org/trending/daily.json')
    const books = response.works.slice(0, 100) // Get top 100 books

    const publishers = [
      generatePublisher(1, 'Penguin Random House'),
      generatePublisher(2, 'HarperCollins'),
      generatePublisher(3, 'Simon & Schuster'),
      generatePublisher(4, 'Macmillan Publishers'),
      generatePublisher(5, 'Hachette Book Group'),
    ]

    // Track unique authors
    const authorMap = new Map()
    let authorIdCounter = 1

    // Process books and generate seed data
    const processedBooks = await Promise.all(
      books.map(async (book, index) => {
        // Get author info
        let authorId
        const authorName = book.author_name?.[0] || 'Unknown Author'

        if (!authorMap.has(authorName)) {
          authorId = authorIdCounter++
          authorMap.set(authorName, authorId)
        } else {
          authorId = authorMap.get(authorName)
        }

        // Get cover image if available
        const coverId = book.cover_i
        const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null

        // Assign a random publisher
        const publisherId = Math.floor(Math.random() * publishers.length) + 1

        return {
          _id: `book-${index + 1}`,
          _type: 'book',
          title: book.title,
          authors: [
            {
              _type: 'reference',
              _ref: `author-${authorId}`,
            },
          ],
          publisher: {
            _type: 'reference',
            _ref: `publisher-${publisherId}`,
          },
          releaseDate: book.first_publish_year ? `${book.first_publish_year}-01-01` : '2000-01-01',
          status: getRandomStatus(),
          ...(coverUrl && {
            cover: {
              _type: 'image',
              _sanityAsset: `image@${coverUrl}`,
            },
          }),
        }
      }),
    )

    // Combine all documents
    const documents = [
      ...Array.from(authorMap.entries()).map(([name, id]) => generateAuthor(id, name)),
      ...publishers,
      ...processedBooks,
    ]

    // Write to seed.ndjson
    const seedPath = path.join(__dirname, '..', 'seed.ndjson')
    const seedContent = documents.map((doc) => JSON.stringify(doc)).join('\n')
    fs.writeFileSync(seedPath, seedContent)

    console.log(`Successfully generated seed file with ${documents.length} documents`)
  } catch (error) {
    console.error('Error generating seed file:', error)
    process.exit(1)
  }
}

main()
