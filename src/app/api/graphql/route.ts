// pages/api/graphql.ts

import { createYoga } from 'graphql-yoga';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from '../../../src/graphql/schema';
import { resolvers } from '../../../src/graphql/resolvers';
import { extractUserId } from '../../../src/middleware/auth';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema: {
    typeDefs,
    resolvers,
  },
  context: async ({ req }) => {
    const authHeader = req.headers.get('authorization') || '';
    const userId = extractUserId(authHeader);
    return {
      prisma,
      userId,
      req,
    };
  },
  graphqlEndpoint: '/api/graphql',
  graphiql: process.env.NODE_ENV !== 'production',
});
