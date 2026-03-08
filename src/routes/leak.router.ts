import { Router } from 'express';
import { leakController } from '../controllers/leak.controller';

export const leakRouter = Router();

leakRouter.get('/problem', leakController.problem);
leakRouter.get('/solution', leakController.solution);
