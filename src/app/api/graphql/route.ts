// src/app/api/graphql/route.ts

import { createYoga } from 'graphql-yoga';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '../../../graphql/schema';
import { resolvers } from '../../../graphql/resolvers';
import { extractUserId } from '../../../middleware/auth';

const prisma = new PrismaClient();

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Create Yoga instance
const { handleRequest } = createYoga({
  schema,
  context: async ({ request }) => {
    const authHeader = request.headers.get('authorization') || '';
    const userId = extractUserId(authHeader);
    return {
      prisma,
      userId,
      request,
    };
  },
  graphqlEndpoint: '/api/graphql',
  graphiql: process.env.NODE_ENV !== 'production',
  cors: true,
});

// Handle requests
export async function GET(request: NextRequest) {
  const response = new Response();
  return handleRequest(request, response);
}

export async function POST(request: NextRequest) {
  const response = new Response();
  return handleRequest(request, response);
}

// Route config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
