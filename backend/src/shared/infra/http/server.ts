import 'express-async-errors';
import 'reflect-metadata';
import 'dotenv/config';

import express, { json, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import uploadConfig from '@config/upload';
import '@shared/infra/typeorm';
import '@shared/container';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

const app = express();
app.use(rateLimiter);
app.use(cors());
app.use('/files', express.static(uploadConfig.uploadsPath));
app.use(json());
app.use(routes);
app.use(errors());

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'Error',
        message: error.message,
      });
    }

    console.log(error);

    return response.status(500).json({
      status: 'Error',
      message: 'Internal Server Error',
    });
  }
);

app.listen(3333, () => console.log('🚀 Back-end started on port 3333'));
