import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../client/queries'
import { useEffect, useState } from 'react'
import BooksTable from './BooksTable'

const Books = ({ show }) => {

  const [filter, setFilter] = useState([])
  const [books, setBooks] = useState([])

  const fetchBooks = useQuery(ALL_BOOKS, {
    variables : filter.length > 0 ? { genres: filter } : {},
    // complexity in keeping the cache updated rises significantly with queries with
    // multiple filters, so caching is disabled (no-cache) for those queries
    fetchPolicy: filter.length > 1 ? 'no-cache' : 'cache-first'
  })

  useEffect(() => {
    if (fetchBooks.data) {
      setBooks(fetchBooks.data.allBooks)
    }
  },
  [fetchBooks.data])

  useEffect(() => {
    if (!show)
      setFilter([])
  },
  [show])

  if (!show)
    return null

  const extractGenres = books => {
    const genres = books
      .map(book => book.genres)
      .flat()
      .filter(genre => !filter.includes(genre))

    return [...new Set(genres)]
  }

  return (
    <div>
      <h2>Books</h2>
      { filter.length > 0 && <h4>{`Filters: ${filter.join(', ')}`}</h4> }
      { fetchBooks.loading
        ?
        <div>loading...</div>
        :
        <>
          <BooksTable books={ books }/>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8, marginTop: 32 }}>
            { books ?
              extractGenres(books).map(genre =>
                <button
                  key={ genre }
                  onClick={() => setFilter([...filter, genre]) }>
                  { genre }
                </button>
              ) : null
            }
            <button onClick={() => setFilter([]) }>clear filter</button>
          </div>
        </>
      }

    </div>
  )
}

export default Books
