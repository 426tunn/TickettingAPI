import { MongoClient, MongoClientOptions } from 'mongodb';

async function getDbPath(): Promise<void> {
    const uri = 'mongodb://localhost:27017/BlackHole'; // Replace with your MongoDB URI
    const options: MongoClientOptions = {};
    const client = new MongoClient(uri, options);

    try {
        await client.connect();
        const adminDb = client.db().admin();
        const commandLineOptions = await adminDb.command({ getCmdLineOpts: 1 });
        const dbPath = commandLineOptions.parsed.storage.dbPath;
        console.log('Database Path:', dbPath);
    } catch (error) {
        console.error('Error retrieving DB path:', error);
    } finally {
        await client.close();
    }
}

getDbPath().catch(console.error);
