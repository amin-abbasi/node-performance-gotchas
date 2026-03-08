import { logger } from './logger.service';

export const computeService = {
    blockLoop: (): number => {
        logger.info('Blocking loop with a massive synchronous array operation...');
        const start = Date.now();
        // Increased from 50M to 100M to ensure a VERY noticeable wait on modern CPUs
        const hugeArray = Array.from({ length: 100_000_000 }, (_, i) => i);
        const result = hugeArray.reduce((acc, val) => acc + val, 0);

        logger.info(`Finished blocking in ${Date.now() - start}ms.`);
        return result;
    },

    unblockLoop: (): Promise<number> => {
        return new Promise((resolve) => {
            logger.info('Breaking up task with setImmediate (or Promises)...');
            const start = Date.now();

            let totalSum = 0;
            const CHUNK_SIZE = 1_000_000;
            const MAX_WORK = 100_000_000;

            const chunk = (currentStart: number) => {
                if (currentStart >= MAX_WORK) {
                    logger.info(`Finished unblocking in ${Date.now() - start}ms.`);
                    return resolve(totalSum);
                }

                const currentEnd = Math.min(currentStart + CHUNK_SIZE, MAX_WORK);

                setImmediate(() => {
                    // Process a small slice synchronously, but give control back after
                    for (let i = currentStart; i < currentEnd; i++) {
                        totalSum += i;
                    }
                    chunk(currentEnd); // Schedule the next chunk
                });
            };

            chunk(0);
        });
    },
};
