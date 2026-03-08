import { Request, Response } from 'express';
import { streamService } from '../services/stream.service';
import { logger } from '../services/logger.service';

export const streamController = {
    problem: async (req: Request, res: Response) => {
        logger.warn('Triggered Memory-Clogging Stream (/api/streams/problem)');

        try {
            await streamService.badStream(res);
        } catch (error) {
            logger.error(`Error in bad stream: ${error}`);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to process file' });
            }
        }
    },

    solution: async (req: Request, res: Response) => {
        logger.success('Triggered Piped Stream (/api/streams/solution)');

        try {
            await streamService.goodStream(res);
        } catch (error) {
            logger.error(`Error in good stream: ${error}`);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to process file' });
            }
        }
    },
};
