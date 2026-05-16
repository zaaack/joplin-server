const sqlite3 = require('sqlite3');
const fs = require('fs');

const dbPath = process.argv[2];
if (!dbPath) {
    console.error('Usage: node set-wal-mode.js <db-path>');
    process.exit(1);
}

if (!fs.existsSync(dbPath)) {
    console.log(`Database not found: ${dbPath}, skipping`);
    process.exit(0);
}

const db = new sqlite3.Database(dbPath);
db.run("PRAGMA journal_mode=WAL;", function (err) {
    if (err) {
        console.error('Failed to set WAL mode:', err.message);
        process.exit(1);
    }
    console.log('WAL mode enabled');
    db.close(process.exit);
});
