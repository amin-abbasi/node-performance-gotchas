const API_URL = 'http://localhost:3333';

const fetchHealthCheck = async (id) => {
    const start = Date.now();
    try {
        await fetch(`${API_URL}/healthCheck`);
        console.log(`[Ping ${id}] 🟢 Responded in ${Date.now() - start}ms`);
    } catch (err) {
        console.error(`[Ping ${id}] 🔴 Failed: ${err.message}`);
    }
};

async function testBlocking(endpoint) {
    console.log(`\n🚀 Starting Heavy Compute Request: /api/compute/${endpoint}`);
    console.log(`While this is calculating, we will ping the health-check every 300ms!`);
    console.log(`If the Event Loop is blocked, the pings will freeze and timeout.\n`);

    // We start pinging immediately
    let pingInterval;
    let pingCount = 1;
    pingInterval = setInterval(() => {
        fetchHealthCheck(pingCount++);
    }, 300);

    const startCompute = Date.now();
    try {
        const res = await fetch(`${API_URL}/api/compute/${endpoint}`);
        const data = await res.json();
        console.log(
            `\n✅ Heavy Compute Finished in ${Date.now() - startCompute}ms! (Result: ${data.result})`,
        );
    } catch (err) {
        console.error(`\n❌ Heavy Compute Failed:`, err.message);
    } finally {
        clearInterval(pingInterval);
        console.log(`Test Complete.\n`);
    }
}

async function run() {
    const type = process.argv[2];
    if (type === 'problem') {
        console.log('TESTING: SYNCHRONOUS BLOCKING');
        await testBlocking('problem');
    } else if (type === 'solution') {
        console.log('TESTING: ASYNCHRONOUS UNBLOCKING');
        await testBlocking('solution');
    } else {
        console.log('Usage: node scripts/spam-block.mjs <problem|solution>');
    }
}

run();
