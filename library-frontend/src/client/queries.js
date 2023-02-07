import { gql } from '@apollo/client'
import { BOOK_DETAILS } from './fragments'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name,
      born,
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks($genres: [String!]) {
    allBooks(genres: $genres) {
      ...BookDetails
    }
  }
  ${ BOOK_DETAILS }
`

export const ME = gql`
  query {
    me {
      username,
      favouriteGenre
    }
  }
`