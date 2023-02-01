import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../client/queries'
import {useEffect, useState} from 'react'

const Books = ({ show }) => {

  const allBooks = useQuery(ALL_BOOKS)

  const [books, setBooks] = useState(null)
  const [filter, setFilter] = useState('')

  const filterByGenre = (books, filter) => {
    return filter
      ? allBooks.data.allBooks.filter(book => book.genres.includes(filter))
      : allBooks.data.allBooks
  }

  useEffect(() => {
    if (allBooks.data)
      setBooks(filterByGenre(books, filter))
  },
  [allBooks.data, filter])

  if (allBooks.loading || !books)
    return <div>loading...</div>

  const extractGenres = books => {
    const genres = books.map(book => book.genres).flat()
    return [...new Set(genres)]
  }

  return (
    show
    ? <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          { books.map(book => (
            <tr key={ book.title }>
              <td>{ book.title }</td>
              <td>{ book.author.name }</td>
              <td>{ book.published }</td>
            </tr>
          ))}
        </tbody>
      </table>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8, marginTop: 32 }}>
          { extractGenres(books).map(genre =>
              <button
                key={ genre }
                onClick={() => setFilter(genre) }>
                { genre }
              </button>
            )
          }
          <button onClick={() => setFilter(null) }>clear filter</button>
        </div>
    </div>
    :
    null
  )
}

export default Books
