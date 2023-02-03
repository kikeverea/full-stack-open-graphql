import BooksTable from './BooksTable'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../client/queries'
import { useFilterableBooks } from '../hooks/useFilterableBooks'
import {useEffect } from 'react'

const Recommendations = ({ show, user }) => {

  const allBooks = useQuery(ALL_BOOKS)
  const [books, changeFilter, changeBooks, filter] = useFilterableBooks()

  useEffect(() => {
    if (allBooks.data)
      changeBooks(allBooks.data.allBooks)
  },
  [allBooks.data])

  useEffect(() => {
    if (user)
      changeFilter(user.favouriteGenre)
  }, [user])

  if (!show)
    return null

  if (allBooks.loading)
    return <div>loading...</div>

  return (
    <>
      <h1>Recommendations</h1>
      <p>Books in your favourite genre: <strong>{ filter[0] }</strong>
      </p>
      <BooksTable books={ books }/>
    </>
  )
}

export default Recommendations