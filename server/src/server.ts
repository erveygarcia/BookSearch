import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './services/auth.js';
import db from './config/connection.js';

import cors from 'cors';
import bodyParser from 'body-parser';

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => authMiddleware({ req }),
    })
  );

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 API server running on http://localhost:${PORT}`);
      console.log(`🚀 GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startServer();
