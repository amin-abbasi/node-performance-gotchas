import * as fs from 'fs';
import { Response } from 'express';
import path from 'path';
import { logger } from './logger.service';

// Helper to create a dummy large file if it doesn't exist
const FILE_PATH = path.join(process.cwd(), 'huge-file.txt');

const ensureFileExists = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(FILE_PATH)) {
            return resolve();
        }
        logger.info('Generating dummy huge file for stream tests (this may take a moment)...');
        const writeStream = fs.createWriteStream(FILE_PATH);
        // creating approx ~500MB file to guarantee an OOM crash when loaded fully into RAM
        // (Default Node.js max-old-space-size is around 1.4 - 2GB, but buffer limits are lower)
        for (let i = 0; i < 500000; i++) {
            writeStream.write(
                'This is a simulated very large file designed to test Node.js memory limits and backpressure handling. '.repeat(
                    10,
                ) + '\n',
            );
        }
        writeStream.end();
        writeStream.on('finish', () => resolve());
        writeStream.on('error', reject);
    });
};

export const streamService = {
    badStream: async (res: Response): Promise<void> => {
        await ensureFileExists();

        return new Promise((resolve, reject) => {
            // BAD: Reads the entire file into V8 memory FIRST before sending it.
            // If the file is 2GB and you have 1GB RAM, the Node process will crash with an OOM Error.
            fs.readFile(FILE_PATH, (err, data) => {
                if (err) return reject(err);

                // Send the massive buffer all at once
                res.send(data);
                resolve();
            });
        });
    },

    goodStream: async (res: Response) => {
        await ensureFileExists();

        // GOOD: Creating a readable stream.
        const readStream = fs.createReadStream(FILE_PATH);

        // .pipe() listens for 'drain' events.
        // It writes data chunk by chunk. If the network is slow, it pauses reading from the disk automatically.
        readStream.pipe(res);

        readStream.on('error', (err) => {
            logger.error('Stream error: ' + err.message);
            if (!res.headersSent) res.status(500).send('Internal Server Error');
        });
    },
};
