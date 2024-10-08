import prisma from '../../../../../lib/prisma';

export async function GET(request) {
  try {
    const Inventory = await prisma.inventory.findMany({
      orderBy: {
        dateCreated: 'desc',
      }
    });
    return new Response(JSON.stringify(Inventory), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching Inventory:', error);
    return new Response(JSON.stringify({ error: 'Error fetching Inventory' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
