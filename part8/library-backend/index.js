const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')

const typeDefs = require('./typeDefinitions')
const resolvers = require('./resolvers')
const config = require('./util/config')

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
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})