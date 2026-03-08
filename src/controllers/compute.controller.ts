import { Request, Response } from 'express';
import { computeService } from '../services/compute.service';
import { logger } from '../services/logger.service';

export const computeController = {
    problem: (req: Request, res: Response) => {
        logger.warn('Triggered Synchronous Block (/api/compute/problem)');

        // This blocks the event loop! No other request can be served while this runs.
        const result = computeService.blockLoop();
        res.json({ message: 'Computation complete (Event loop was blocked)', result });
    },

    solution: async (req: Request, res: Response) => {
        logger.success('Triggered Asynchronous Computation (/api/compute/solution)');

        // This allows the event loop to breathe and process other requests concurrently.
        const result = await computeService.unblockLoop();
        res.json({ message: 'Computation complete (Event loop was free)', result });
    },
};
