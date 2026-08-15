import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to Data.json in public folder
const dataFilePath = path.join(process.cwd(), 'public', 'LSO.json');

// Ensure the directory exists
function ensureDirectoryExists() {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Helper function to read data from file
function readData() {
  try {
    ensureDirectoryExists();
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      // Create default data structure
      const defaultData = { members: [] };
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    
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
    ensureDirectoryExists();
    
    // Write with proper formatting
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('File written successfully to:', dataFilePath);
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    return false;
  }
}

// GET: Fetch all members
export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ members: [] });
  }
}

// POST: Add new member
export async function POST(request: Request) {
  try {
    const newMember = await request.json();
    const data = readData();
    
    data.members.push(newMember);
    
    if (writeData(data)) {
      return NextResponse.json({ success: true, member: newMember, members: data.members });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to write file' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
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
        return NextResponse.json({ success: true, member, members: data.members });
      } else {
        return NextResponse.json({ success: false, error: 'Failed to write file' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ success: false, error: 'Invalid index' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in PUT:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
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
        return NextResponse.json({ success: true, member: deletedMember[0], members: data.members });
      } else {
        return NextResponse.json({ success: false, error: 'Failed to write file' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ success: false, error: 'Invalid index' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in DELETE:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
                  }
