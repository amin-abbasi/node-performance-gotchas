import http from 'http';

const API_URL = 'http://localhost:3333/api/streams';

function testStreamLimit(endpoint) {
    console.log(`\n🚀 Starting Stream Test: /api/streams/${endpoint}`);
    console.log(`Watch your server terminal for the memory logs!`);
    console.log(`Downloading dummy file...`);

    const start = Date.now();
    let downloadedBytes = 0;

    // Using native http module to capture chunks as they arrive
    // fetch() buffers too much in memory for this specific huge file test.
    http.get(`${API_URL}/${endpoint}`, (res) => {
        if (res.statusCode !== 200) {
            console.error(`❌ Request Failed. Status Code: ${res.statusCode}`);
            res.resume();
            return;
        }

        res.on('data', (chunk) => {
            downloadedBytes += chunk.length;
            // Print progress every ~50MB to avoid console spam
            if (downloadedBytes % (50 * 1024 * 1024) < 65536) {
                console.log(`📥 Downloaded: ${(downloadedBytes / 1024 / 1024).toFixed(2)} MB...`);
            }
        });

        res.on('end', () => {
            console.log(`\n✅ Download Complete!`);
            console.log(`Total Size: ${(downloadedBytes / 1024 / 1024).toFixed(2)} MB`);
            console.log(`Time Elapsed: ${(Date.now() - start) / 1000} seconds\n`);
        });
    }).on('error', (err) => {
        console.error(`\n❌ Server Connection Dropped! (Did it crash?)`);
        console.error(`Error details: ${err.message}\n`);
    });
}

function run() {
    const type = process.argv[2];
    if (type === 'problem') {
        console.log('TESTING: FS.READFILE (ENTIRE FILE IN RAM)');
        testStreamLimit('problem');
    } else if (type === 'solution') {
        console.log('TESTING: FS.CREATEREADSTREAM (PIPED CHUNKS)');
        testStreamLimit('solution');
    } else {
        console.log('Usage: node scripts/spam-stream.mjs <problem|solution>');
    }
}

run();
