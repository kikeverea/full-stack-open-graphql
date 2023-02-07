import { gql } from '@apollo/client'
import { BOOK_DETAILS } from './fragments'

export const ADD_BOOK = gql`
  mutation createBook ($author: String!, $genres: [String!], $published: Int!, $title: String!){
    addBook(
      title: $title
      author: $author,
      published: $published,
      genres: $genres
    )
    { ...BookDetails }
  }
  ${ BOOK_DETAILS }
`

export const UPDATE_AUTHOR_BORN = gql`
  mutation updateAuthor ($author: String!, $setBornTo: Int!) {
    editAuthor(
      name: $author,
      setBornTo: $setBornTo
  ) {
      name, born
    }
  }
`

export const LOGIN = gql`
  mutation login ($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password
    ) {
        value
    }
  }
`