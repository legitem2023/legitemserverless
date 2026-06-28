// src/app/api/graphql/route.ts

import { createYoga } from 'graphql-yoga';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from '../../../graphql/schema';
import { resolvers } from '../../../graphql/resolvers';
import { extractUserId } from '../../../middleware/auth';

const prisma = new PrismaClient();

// Create Yoga instance
const yoga = createYoga({
  schema: {
    typeDefs,
    resolvers,
  },
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
  // Enable CORS
  cors: {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
  },
});

// Handle GET requests
export async function GET(request: NextRequest) {
  return yoga.handleRequest(request, {
    req: request,
    res: new Response(),
  });
}

// Handle POST requests
export async function POST(request: NextRequest) {
  return yoga.handleRequest(request, {
    req: request,
    res: new Response(),
  });
}

// Optional: Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Route segment config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
