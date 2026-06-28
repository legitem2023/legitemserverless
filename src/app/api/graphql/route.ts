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
const yoga = createYoga({
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

// Handle GET requests
export async function GET(request: NextRequest) {
  // Use yoga.handleRequest with proper arguments
  return yoga.handleRequest(request, {
    // Empty object for context
  });
}

// Handle POST requests
export async function POST(request: NextRequest) {
  return yoga.handleRequest(request, {});
}

// Route config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
