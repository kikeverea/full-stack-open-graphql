const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: [true, 'Name must be unique'],
    minLength: [4, 'Author name must have at least 4 characters']
  },
  born: {
    type: Number,
    min: [0, 'Year can\'t be negative' ]
  }
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Author = mongoose.model('Author', schema)

module.exports = Author