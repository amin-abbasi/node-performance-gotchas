import { Router } from 'express';
import { streamController } from '../controllers/stream.controller';

export const streamRouter = Router();

streamRouter.get('/problem', streamController.problem);
streamRouter.get('/solution', streamController.solution);
