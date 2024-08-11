import prisma from '../../../../../lib/prisma';
export async function GET(request) {
  try {
    const Account = await prisma.user.findMany({
        include: {
            AccountDetails:true
        }
    });
    return new Response(JSON.stringify(Account), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching Inventory' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
