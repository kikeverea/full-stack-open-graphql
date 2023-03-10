const gql = require('graphql-tag')

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int
    id: ID!
  }
  
  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genres: [String!]): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]
    )
    : Book
    
    editAuthor(
      name: String!
      setBornTo: Int!
    )
    : Author
      
    createUser(
      username: String!
      favouriteGenre: String!
    )
    : User

    login(
      username: String!
      password: String!
    )
    : Token
  }
  
  type Subscription {
    bookAdded: Book!
  }
`

module.exports = typeDefs