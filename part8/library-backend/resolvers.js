const Book = require('./models/Book')
const Author = require('./models/Author')
const {UserInputError} = require('apollo-server')

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
    }
  },
  Mutation: {
    addBook: async (root, args) => {
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
    editAuthor: async (root, args) => {

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