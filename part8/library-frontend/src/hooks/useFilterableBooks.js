import { useState } from 'react'

export const useFilterableBooks = () => {

  const [allBooks, setAllBooks] = useState(null)
  const [books, setBooks] = useState(null)
  const [filter, setFilter] = useState([])

  const changeFilter = newFilter => {
    const updatedFilter = newFilter ? [...filter, newFilter] : []
    setFilter(updatedFilter)
    setBooks(newFilter ? filterBooks(updatedFilter) : allBooks)
  }

  const changeBooks = collection => {
    setAllBooks(collection)
    setBooks(filter.length > 0 ? filterBooks(filter) : collection)
  }

  const filterBooks = (filter) =>
    allBooks.filter(book => filter.every(genre => book.genres.includes(genre)))

  return [
    books,
    changeFilter,
    changeBooks,
    filter
  ]
}
