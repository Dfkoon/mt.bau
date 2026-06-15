import { readFileSync } from 'fs';

const PROJECT_ID = "koon-609da";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Get full token from firebase-tools config
import { execSync } from 'child_process';
const tokenRaw = execSync(`cat ~/.config/configstore/firebase-tools.json`).toString();
const tokenData = JSON.parse(tokenRaw);
const ACCESS_TOKEN = tokenData.tokens?.access_token || '';
console.log("Token prefix:", ACCESS_TOKEN.substring(0, 30));

function toFirestoreValue(val) {
    if (val === null || val === undefined) return { nullValue: null };
    if (typeof val === 'string') return { stringValue: val };
    if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
    if (typeof val === 'boolean') return { booleanValue: val };
    if (val instanceof Date) return { timestampValue: val.toISOString() };
    if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
    if (typeof val === 'object') {
        const fields = {};
        for (const [k, v] of Object.entries(val)) {
            fields[k] = toFirestoreValue(v);
        }
        return { mapValue: { fields } };
    }
    return { stringValue: String(val) };
}

async function run() {
    // Read the archive data we exported
    const archiveData = JSON.parse(readFileSync('./archive_data.json', 'utf8'));
    console.log(`Writing archive with ${archiveData.totalDonations} donations...`);

    const firestoreDoc = {
        fields: {
            label: toFirestoreValue(archiveData.label),
            archivedAt: toFirestoreValue(archiveData.archivedAt),
            totalDonations: toFirestoreValue(archiveData.totalDonations),
            donationsData: toFirestoreValue(archiveData.donationsData)
        }
    };

    const res = await fetch(`${BASE_URL}/campaignArchives`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ACCESS_TOKEN}`
        },
        body: JSON.stringify(firestoreDoc)
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const result = await res.json();
    const docId = result.name?.split('/').pop();
    console.log(`✅ Archive created! Doc ID: ${docId}`);

    // Verify materialDonations is empty
    const verifyRes = await fetch(`${BASE_URL}/materialDonations?pageSize=10`, {
        headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });
    const verifyData = await verifyRes.json();
    const remaining = (verifyData.documents || []).length;
    console.log(`📊 Remaining donations: ${remaining} (should be 0)`);
    
    console.log("\n🎉 Done! Archive complete:");
    console.log(`   - Archived: ${archiveData.totalDonations} donations`);
    console.log(`   - Label: ${archiveData.label}`);
    console.log(`   - Live materialDonations: ${remaining}`);
}

run().catch(e => {
    console.error("Error:", e.message);
    process.exit(1);
});
