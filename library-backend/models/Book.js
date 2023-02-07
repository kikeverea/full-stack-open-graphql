const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title required'],
    unique: [true, 'Title must be unique'],
    minLength: [2, 'Book title must have at least 2 characters']
  },
  published: {
    type: Number,
    min: [0, 'Year can\'t be negative']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [String]
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Book = mongoose.model('Book', schema)

module.exports = Book