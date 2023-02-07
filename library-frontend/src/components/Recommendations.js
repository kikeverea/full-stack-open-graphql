import BooksTable from './BooksTable'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../client/queries'
import { useEffect, useState } from 'react'

const Recommendations = ({ show, user }) => {

  const fetchBooks = useQuery(
    ALL_BOOKS,
    { variables : user ? { genres: [user.favouriteGenre] } : {} })

  const [books, setBooks] = useState([])

  useEffect(() => {
    if (fetchBooks.data)
      setBooks(fetchBooks.data.allBooks)
  },
  [fetchBooks.data])

  useEffect(() => {
    if (user)
      fetchBooks.refetch()
  }, [user])

  if (!show)
    return null

  if (fetchBooks.loading)
    return <div>loading...</div>

  return (
    <>
      <h1>Recommendations</h1>
      <p>Books in your favourite genre: <strong>{ user.favouriteGenre }</strong>
      </p>
      <BooksTable books={ books }/>
    </>
  )
}

export default Recommendations