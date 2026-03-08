import { Request, Response } from 'express';
import { leakService } from '../services/leak.service';
import { logger } from '../services/logger.service';

export const leakController = {
    problem: (req: Request, res: Response) => {
        logger.warn('Triggered Memory Leak (/api/leaks/problem)');
        const data = leakService.simulateLeak();
        res.json(data);
    },
    solution: (req: Request, res: Response) => {
        logger.success('Triggered Memory Safe Request (/api/leaks/solution)');
        const data = leakService.safeOperation();
        res.json(data);
    },
};
