const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')

const jwt = require('jsonwebtoken')

const { UserInputError, AuthenticationError} = require('apollo-server')

const DUMMY_PASSWORD = 'secret'

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => Book.find({}).populate('author'),
    allAuthors: async () => {
      const authors = await Author.find({})

      const setBookCount = async author => {
        const authorBooks = await Book.find({ author: author._id })
        return { name: author.name, born: author.born, bookCount: authorBooks.length }
      }

      return authors.map(setBookCount)
    },
    me: (root, args, { loggedInUser }) => loggedInUser
  },
  Mutation: {
    addBook: async (root, args, { loggedInUser }) => {
      if (!loggedInUser)
        throw new AuthenticationError('Not authenticated')

      let author = await Author.findOne({ name: args.author })

      if (!author)
        author = await createAuthor(args)

      try {
        const saved = await new Book({ ...args, author: author._id }).save()
        return { ...args, id: saved.id, author: author }
      }
      catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
    },
    editAuthor: async (root, args, { loggedInUser }) => {
      if (!loggedInUser)
        throw new AuthenticationError('Not authenticated')

      if (args.setBornTo < 0)
        throw new UserInputError('Year can\'t be negative', {
          invalidArgs: args.setBornTo
        })

      const author = await Author.findOne({ name: args.name })

      try {
        return Author.findByIdAndUpdate(author._id,
          { born: args.setBornTo },
          { new: true, runValidators: true, context: 'query' })
      }
      catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args.name
        })
      }
    },
    createUser: async (root, args) => {
      try {
        return new User({ ...args }).save()
      }
      catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== DUMMY_PASSWORD)
        throw new UserInputError('Wrong credentials')

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      const JWT_SECRET = process.env.SECRET
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  }
}

const createAuthor = async args => {
  try {
    return await new Author({ name: args.author }).save()
  }
  catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: args.author
    })
  }
}

module.exports = resolvers