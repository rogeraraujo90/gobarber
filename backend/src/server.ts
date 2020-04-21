import express, { json, Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import cors from 'cors';
import routes from './routes';
import 'reflect-metadata';

import uploadConfig from './config/upload';
import './database';
import AppError from './errors/AppError';

const app = express();

app.use(cors());
app.use('/files', express.static(uploadConfig.uploadsPath));
app.use(json());
app.use(routes);

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'Error',
        message: error.message,
      });
    }

    return response.status(500).json({
      status: 'Error',
      message: 'Internal Server Error',
    });
  }
);

app.listen(3333, () => console.log('🚀 Back-end started on port 3333'));
