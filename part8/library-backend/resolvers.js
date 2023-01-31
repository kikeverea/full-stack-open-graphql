const Book = require('./models/Book')
const Author = require('./models/Author')

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

      if (!author) {
        author = new Author({
          name: args.author
        })

        author = await author.save()
      }

      const saved = await new Book({ ...args, author: author._id }).save()

      return { ...args, id: saved.id, author: author }
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })

      return Author.findByIdAndUpdate(author._id,
        { born: args.setBornTo },
        { new: true, runValidators: true, context: 'query' })
    }
  }
}

module.exports = resolvers