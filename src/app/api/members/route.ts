import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to your Data.json file
const dataFilePath = path.join(process.cwd(), 'public', 'Data.json');

// Helper function to read data from file
function readData() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading file:', error);
    return { members: [] };
  }
}

// Helper function to write data to file
function writeData(data: any) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    return false;
  }
}

// GET: Fetch all members
export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}

// POST: Add new member
export async function POST(request: Request) {
  try {
    const newMember = await request.json();
    const data = readData();
    
    data.members.push(newMember);
    
    if (writeData(data)) {
      return NextResponse.json({ success: true, member: newMember });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to write file' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}

// PUT: Update existing member
export async function PUT(request: Request) {
  try {
    const { index, member } = await request.json();
    const data = readData();
    
    if (index >= 0 && index < data.members.length) {
      data.members[index] = member;
      
      if (writeData(data)) {
        return NextResponse.json({ success: true, member });
      } else {
        return NextResponse.json({ success: false, error: 'Failed to write file' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ success: false, error: 'Invalid index' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}

// DELETE: Remove member
export async function DELETE(request: Request) {
  try {
    const { index } = await request.json();
    const data = readData();
    
    if (index >= 0 && index < data.members.length) {
      const deletedMember = data.members.splice(index, 1);
      
      if (writeData(data)) {
        return NextResponse.json({ success: true, member: deletedMember[0] });
      } else {
        return NextResponse.json({ success: false, error: 'Failed to write file' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ success: false, error: 'Invalid index' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}
