import { app } from './app';
import { logger } from './services/logger.service';

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    logger.highlight(`Node.js Performance Gotchas API - Server is running on: http://localhost:${PORT}
    ╔════════════════════════════════════════════════════════╗
    ║  Available endpoints:                                  ║
    ║    /api/leaks     - Memory leak examples               ║
    ║    /api/compute   - Event loop blocking examples       ║
    ║    /api/streams   - Backpressure examples              ║
    ╚════════════════════════════════════════════════════════╝
    `);
});
