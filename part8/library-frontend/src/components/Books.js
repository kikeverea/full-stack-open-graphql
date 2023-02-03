import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../client/queries'
import { useEffect } from 'react'
import BooksTable from './BooksTable'
import { useFilterableBooks } from '../hooks/useFilterableBooks'

const Books = ({ show }) => {

  const allBooks = useQuery(ALL_BOOKS)
  const [books, changeFilter, changeBooks, filter] = useFilterableBooks()

  useEffect(() => {
    if (allBooks.data) {
      changeBooks(allBooks.data.allBooks)
    }
  },
  [allBooks.data])

  if (allBooks.loading)
    return <div>loading...</div>

  const extractGenres = books => {
    const genres = books
      .map(book => book.genres)
      .flat()
      .filter(genre => !filter.includes(genre))

    return [...new Set(genres)]
  }

  return (
    show ?
      <div>
        <h2>Books</h2>
        { filter.length > 0 && <h4>{`Filters: ${filter.join(', ')}`}</h4> }
        <BooksTable books={ books }/>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8, marginTop: 32 }}>
          { books ?
              extractGenres(books).map(genre =>
              <button
                key={ genre }
                onClick={() => changeFilter(genre) }>
                { genre }
              </button>
          ) : null
          }
          <button onClick={() => changeFilter(null) }>clear filter</button>
        </div>
      </div>
    :
    null
  )
}

export default Books
