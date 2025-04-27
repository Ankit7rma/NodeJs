const fs = require('fs').promises;

(async () => {
    console.time("writefile");
    const filehandler = await fs.open('test.txt', 'w');

    for (let i = 0; i <= 100; i++) {
        await filehandler.write(`${i}\n`);
    }

    console.timeEnd("writefile");
})();
