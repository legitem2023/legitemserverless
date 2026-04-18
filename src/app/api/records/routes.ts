// app/api/records/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Use absolute path to ensure it works in all environments
const dataFilePath = path.join(process.cwd(), 'data', 'records.json');

async function readRecords() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it
    await fs.writeFile(dataFilePath, JSON.stringify([], null, 2));
    return [];
  }
}

async function writeRecords(records: any[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(records, null, 2));
}

export async function GET() {
  try {
    const records = await readRecords();
    return NextResponse.json(records);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to read records' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const records = await readRecords();
    
    const newRecord = {
      id: Date.now().toString(),
      pangalan: body.pangalan,
      callSign: body.callSign,
      petsaUnangTupad: body.petsaUnangTupad,
      petsaIkalawangTupad: body.petsaIkalawangTupad,
    };
    
    records.push(newRecord);
    await writeRecords(records);
    
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}
