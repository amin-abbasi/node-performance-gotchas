import { Router } from 'express';
import { computeController } from '../controllers/compute.controller';

export const computeRouter = Router();

computeRouter.get('/problem', computeController.problem);
computeRouter.get('/solution', computeController.solution);
