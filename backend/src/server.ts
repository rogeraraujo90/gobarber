import express, { json } from 'express';
import cors from 'cors';
import routes from './routes';
import 'reflect-metadata';

import './database';

const app = express();

app.use(cors());
app.use(json());
app.use(routes);

app.listen(3333, () => console.log('🚀 Back-end started on port 3333'));
