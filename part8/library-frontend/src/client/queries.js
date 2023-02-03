import { gql } from '@apollo/client'

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
  query allBooks($genres: [String!]){
    allBooks(genres: $genres) {
      title,
      author {
        name,
        born
      },
      published,
      genres
    }
  }  
`

export const ME = gql`
  query {
    me {
      username,
      favouriteGenre
    }
  }
`