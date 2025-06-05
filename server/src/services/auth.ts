// auth.ts
import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

const secretKey = process.env.JWT_SECRET || 'default-secret';
const expiresIn = '1h';

export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  return jwt.sign(payload, secretKey, { expiresIn });
};

export const authMiddleware = ({ req }: { req: Request }) => {
  const authHeader = req.headers.authorization || '';
  let token = '';

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) return {};

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    return { user: decoded };
  } catch (err) {
    console.warn('Invalid token');
    return {};
  }
};
