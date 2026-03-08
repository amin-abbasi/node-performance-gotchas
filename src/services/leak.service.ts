import { logger } from './logger.service';

const logMemory = (label: string) => {
    const usage = process.memoryUsage();
    const toMB = (bytes: number) => (bytes / 1024 / 1024).toFixed(2);
    logger.info(`[${label}] RSS: ${toMB(usage.rss)}MB | Heap Used: ${toMB(usage.heapUsed)}MB`);
};

const globalArrayStore: { timestamp: number; payload: any[]; metadata: number }[] = [];

export const leakService = {
    simulateLeak: () => {
        // Attempt GC before allocating to show memory baselines
        if (global.gc) {
            global.gc();
            logMemory('LEAK (Base memory - GC tried to clean up)');
        }

        const largeObjectChunk = new Array(10_000_000).fill('📦');
        globalArrayStore.push({
            timestamp: Date.now(),
            payload: largeObjectChunk,
            metadata: Math.random(),
        });

        logMemory('LEAKING (Unreachable by Garbage Collector)');

        return {
            message: 'Leak created',
            globalStoreSize: globalArrayStore.length,
        };
    },

    safeOperation: () => {
        // Run GC to prove previous local variables were cleaned up!
        if (global.gc) {
            global.gc();
            logMemory('SAFE (Base memory - After previous GC cleanup)');
        }

        const largeObjectChunk = new Array(10_000_000).fill('📦');
        const localStore = [
            { timestamp: Date.now(), payload: largeObjectChunk, metadata: Math.random() },
        ];

        logMemory('SAFE (Reachable locally until fn ends)');

        return {
            message: 'Safe operation finished',
            localStoreSize: localStore.length,
        };
    },
};
