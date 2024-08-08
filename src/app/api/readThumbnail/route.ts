import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const skills = await prisma.inventory.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        thumbnail: true,
        category: true,
        color: true,
      },
    });
    return new NextResponse(JSON.stringify(skills), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch skills' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
