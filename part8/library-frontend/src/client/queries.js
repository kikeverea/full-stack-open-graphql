import { gql } from '@apollo/client'

export const allAuthors = gql`
  query {
    allAuthors {
      name,
      born,
      bookCount
    }
  }
`