const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const typeDefs = require('./schema')
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

// use a function, so it can be called asynchronously and await for the GraphQl
// server to start, before express starts listening to the specified port.
const start = async () => {
  const app = express()

  // The httpServer handles incoming requests to our Express app
  const httpServer = http.createServer(app)

  // The web socket server to allow 2-way communication for subscriptions
  const webSocketServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, webSocketServer)

  const graphqlServer = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server (drains the server on stop(), SIGTERM and SIGINT)
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose
            }
          }
        }
      }
    ],
  })

  await graphqlServer.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(graphqlServer, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null

        if (auth && auth.toLowerCase().startsWith('bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET)
          const loggedInUser = await User.findById(decodedToken.id)
          return { loggedInUser }
        }
      }
    }),
  )

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()
