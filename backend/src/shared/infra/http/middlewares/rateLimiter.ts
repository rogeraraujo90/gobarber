import { Request, Response, NextFunction } from 'express';
import Redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';

const redisClient = Redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  enable_offline_queue: false,
});

if (process.env.REDIS_PASS) {
  redisClient.auth(process.env.REDIS_PASS);
}

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimiter',
  points: 10,
  duration: 1,
  blockDuration: 43200,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    await limiter.consume(request.ip);

    next();
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
}
