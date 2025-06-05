import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';

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
  console.log('About to start Express server...');

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => authMiddleware({ req }),
    })
  );

if (db.readyState === 1) {
  // Ya está conectado
  app.listen(PORT, () => {
    console.log(`🌍 API server running on http://localhost:${PORT}`);
    console.log(`🚀 GraphQL at http://localhost:${PORT}/graphql`);
  });
} else {
  // Espera a que se conecte
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 API server running on http://localhost:${PORT}`);
      console.log(`🚀 GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
}

};

startServer();
