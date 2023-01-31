const initialBooks = require('./booksHelper')
const initialAuthors = require('./authorsHelper')
const mongoose = require('mongoose')
const config = require('./config')

const Book = require('../models/Book')
const Author = require('../models/Author')

mongoose.connect(config.DATABASE_URI)
  .then(() => {
    console.log('Database Connected')
  })
  .catch(error => {
    console.error('error connecting to MongoDB:', error.message)
  })

initialAuthors.forEach(async author => {
  const toSave = new Author({ ...author })
  console.log('saving: ', toSave)

  const saved = await toSave.save()
  console.log('generated id: ', saved._id)
})

initialBooks.forEach(async book => {
  const author = await Author.findOne({ name: book.author })

  const newBook = new Book({ ...book, author: author._id})

  await newBook.save()
})