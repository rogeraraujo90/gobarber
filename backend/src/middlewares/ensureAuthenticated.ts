import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config/auth';
import AppError from '../errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Response | void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Missing authentication header', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, config.jwt.secret);
    const { sub } = decodedToken as TokenPayload;

    request.user = { id: sub };
  } catch {
    throw new AppError('Invalid JWT Token', 401);
  }

  next();
}
