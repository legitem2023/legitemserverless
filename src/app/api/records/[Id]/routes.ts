// app/api/records/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'records.json');

async function readRecords() {
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

async function writeRecords(records: any[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(records, null, 2));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const records = await readRecords();
    
    const index = records.findIndex((r: any) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    
    records[index] = { ...records[index], ...body, id };
    await writeRecords(records);
    
    return NextResponse.json(records[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const records = await readRecords();
    
    const filteredRecords = records.filter((r: any) => r.id !== id);
    await writeRecords(filteredRecords);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
