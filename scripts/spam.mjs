const API_URL = 'http://localhost:3333/api/leaks';

async function spam(endpoint, count = 20) {
    console.log(`\n🚀 Spamming /${endpoint} ${count} times...`);
    console.log(`Watch your server terminal for the memory logs!\n`);

    const url = `${API_URL}/${endpoint}`;

    for (let i = 1; i <= count; i++) {
        try {
            const res = await fetch(url);
            const data = await res.json();
            console.log(
                `[${i}/${count}] ✅ OK - Store size: ${data.localStoreSize || data.globalStoreSize || 'unknown'}`,
            );
        } catch (err) {
            console.error(`[${i}/${count}] ❌ Failed:`, err.message);
            // If it crashes, stop spamming.
            break;
        }
    }
}

async function run() {
    const type = process.argv[2];
    if (type === 'leak') {
        // Spamming the leak will eventually crash the server
        await spam('problem', 30);
    } else if (type === 'safe') {
        // Spamming the safe endpoint should survive indefinitely
        await spam('solution', 50);
    } else {
        console.log('Usage: node scripts/spam.mjs <leak|safe>');
        console.log('Example: npm run spam:safe');
    }
}

run();
