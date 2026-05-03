import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const results: any = {};
  
  // Check different paths
  const pathsToCheck = [
    path.join(process.cwd(), 'public', 'Data.json'),
  ];
  
  for (const filePath of pathsToCheck) {
    const dir = path.dirname(filePath);
    results[filePath] = {
      exists: fs.existsSync(filePath),
      dirExists: fs.existsSync(dir),
      dirWritable: false,
      fileWritable: false,
    };
    
    // Check directory write permissions
    if (fs.existsSync(dir)) {
      try {
        fs.accessSync(dir, fs.constants.W_OK);
        results[filePath].dirWritable = true;
      } catch (e) {
        results[filePath].dirWritable = false;
      }
    }
    
    // Check file write permissions if it exists
    if (fs.existsSync(filePath)) {
      try {
        fs.accessSync(filePath, fs.constants.W_OK);
        results[filePath].fileWritable = true;
      } catch (e) {
        results[filePath].fileWritable = false;
      }
    }
  }
  
  return NextResponse.json(results);
}
