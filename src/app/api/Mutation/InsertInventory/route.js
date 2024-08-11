import prisma from '../../../../../lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    const Insert_inventory = await prisma.inventory.create({
      data: data
    });

    return new Response(JSON.stringify(Insert_inventory), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
