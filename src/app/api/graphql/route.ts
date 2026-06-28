// src/app/api/graphql/route.ts

import { createYoga } from 'graphql-yoga';
import { NextRequest, NextResponse } from 'next/server';
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

// Create Yoga instance with the executable schema
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
  cors: {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
  },
});

// Handle GET requests - FIXED: removed req and res
export async function GET(request: NextRequest) {
  return yoga.handleRequest(request);
}

// Handle POST requests - FIXED: removed req and res
export async function POST(request: NextRequest) {
  return yoga.handleRequest(request);
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
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
