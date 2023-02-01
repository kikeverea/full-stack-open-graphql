const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const typeDefs = require('./typeDefinitions')
const resolvers = require('./resolvers')
const config = require('./util/config')

const User = require('./models/User')

mongoose.connect(config.DATABASE_URI)
  .then(() => {
    console.log('Database Connected')
  })
  .catch(error => {
    console.error('error connecting to MongoDB:', error.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET)
      const loggedInUser = await User.findById(decodedToken.id)
      return { loggedInUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})