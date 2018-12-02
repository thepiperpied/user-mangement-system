'use strict';

const {
  GraphQLServer
} = require('graphql-yoga');

const typeDefs = require('./typedefs/index').typeDefs;

const resolvers = require('./resolvers/index').resolver;


require('dotenv').config();

const options = {
  port: process.env.NODE_PORT
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({ ...req
  })
});

server.start(options, ({
    port
  }) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`,
  ),
)