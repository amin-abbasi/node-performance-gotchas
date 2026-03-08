import express, { Express, Request, Response } from 'express';

export const app: Express = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the Node.js Performance API' });
});

import { leakRouter } from './routes/leak.router';
import { computeRouter } from './routes/compute.router';
import { streamRouter } from './routes/stream.router';

app.use('/api/leaks', leakRouter);
app.use('/api/compute', computeRouter);
app.use('/api/streams', streamRouter);
