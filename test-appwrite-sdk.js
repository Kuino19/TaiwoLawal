const { Client, Storage, Databases, ID } = require('node-appwrite');
const fs = require('fs');

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('699760600036a00287a2')
    .setKey('standard_b89ae6596b337b1a5e0c4eb77a72c1365b103002fed1de15b974898dbbc410f91ddc7784161ccd4308a81e4a8bdb5657d0d71c7671fcd0f4417bbe1018fb3533cb5189438e1218b5db6a15892b5b5b416713e55bbac082a8722ad98e25c6bfe16b1c12208d4dc0fd96028d1513673ca2803bb47d88b2aa654032066711041272');

const storage = new Storage(client);
const databases = new Databases(client);

async function checkAppwrite() {
    try {
        const buckets = await storage.listBuckets();
        const dbs = await databases.list();

        fs.writeFileSync('sdk-output.json', JSON.stringify({
            buckets: buckets.buckets.map(b => ({ name: b.name, id: b.$id })),
            databases: dbs.databases.map(db => ({ name: db.name, id: db.$id }))
        }, null, 2));
        console.log('Wrote to sdk-output.json');
    } catch (error) {
        fs.writeFileSync('sdk-error.json', JSON.stringify(error, null, 2));
    }
}

checkAppwrite();
