// pages/api/graphql.ts

import { createYoga } from 'graphql-yoga';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '../../../src/graphql/schema';
import { resolvers } from '../../../src/graphql/resolvers';
import { extractUserId } from '../../../src/middleware/auth';

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createYoga({
  schema,
  context: async ({ req }) => {
    const authHeader = req.headers.authorization || '';
    const userId = extractUserId(authHeader);
    return {
      prisma,
      userId,
      req,
    };
  },
  graphqlEndpoint: '/api/graphql',
  graphiql: process.env.NODE_ENV !== 'production',
  cors: true,
});
