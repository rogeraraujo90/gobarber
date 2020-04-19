import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config/auth';

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
    return response
      .status(401)
      .json({ error: 'Missing authentication header' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, config.jwt.secret);
    const { sub } = decodedToken as TokenPayload;

    request.user = { id: sub };
  } catch {
    return response.status(401).json({ error: 'Invalid JWT Token' });
  }

  next();
}
