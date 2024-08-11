import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(request) {
  try {
    // Parse the request body as JSON
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'productCode',
      'styleCode',
      'category',
      'productType',
      'size',
      'color',
      'price',
      'stock',
      'name',
      'creator',
      'editor',
      'accountCode'
    ];

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        return new NextResponse(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create inventory record
    const Insert_inventory = await prisma.inventory.create({
      data: {
        productCode: data.productCode,
        styleCode: data.styleCode,
        category: data.category,
        productType: data.productType,
        size: data.size,
        color: data.color,
        price: parseFloat(data.price), // Ensure price is a number
        stock: parseInt(data.stock, 10), // Ensure stock is a number
        name: data.name,
        creator: data.creator,
        editor: data.editor,
        accountCode: data.accountCode,
      },
    });

    return new NextResponse(
      JSON.stringify(Insert_inventory),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching Inventory:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error fetching Inventory' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
