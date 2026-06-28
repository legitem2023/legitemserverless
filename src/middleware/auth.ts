// src/middleware/auth.ts

import jwt from 'jsonwebtoken';
import { Context } from '../types';

export const getUserId = (context: Context): string => {
  if (!context.userId) {
    throw new Error('Authentication required');
  }
  return context.userId;
};

export const verifyToken = (token: string): { userId: string } => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const extractUserId = (authHeader?: string): string | null => {
  if (!authHeader) {
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = verifyToken(token);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};
