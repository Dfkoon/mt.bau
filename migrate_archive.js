import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const PROJECT_ID = "koon-609da";
const API_KEY = "AIzaSyCwEYy_wNXXmvq_jDHD-8xvD90ZEVUwHVA";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function apiRequest(url, method = 'GET', body = null) {
    const opts = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
    }
    if (method === 'DELETE') return {};
    return res.json();
}

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
    console.log("Fetching donations via REST API...");
    const data = await apiRequest(`${BASE_URL}/materialDonations?pageSize=300&key=${API_KEY}`);
    const documents = data.documents || [];
    console.log(`Found ${documents.length} donations.`);

    if (documents.length === 0) {
        console.log("Already empty!");
        return;
    }

    // Parse documents
    const allDonations = documents.map(docSnap => {
        const f = docSnap.fields || {};
        const pathParts = docSnap.name.split('/');
        const id = pathParts[pathParts.length - 1];

        const getStr = (field) => f[field]?.stringValue || '';
        const getMaterials = () => {
            if (!f.materials?.arrayValue?.values) return [];
            return f.materials.arrayValue.values.map(v => {
                if (v.mapValue?.fields) {
                    const mf = v.mapValue.fields;
                    return {
                        name: mf.name?.stringValue || '',
                        description: mf.description?.stringValue || '',
                        status: mf.status?.stringValue || 'pending',
                        takerInfo: mf.takerInfo?.mapValue?.fields ? {
                            name: mf.takerInfo.mapValue.fields.name?.stringValue || '',
                            phone: mf.takerInfo.mapValue.fields.phone?.stringValue || '',
                            gender: mf.takerInfo.mapValue.fields.gender?.stringValue || ''
                        } : null
                    };
                }
                return { name: v.stringValue || '', description: '', status: 'pending', takerInfo: null };
            });
        };

        return {
            id,
            studentName: getStr('studentName'),
            phoneNumber: getStr('phoneNumber'),
            studentGender: getStr('studentGender'),
            status: getStr('status'),
            materials: getMaterials(),
            createdAt: f.createdAt?.timestampValue || f.createdAt?.stringValue || new Date().toISOString()
        };
    });

    console.log("Creating campaign archive under 'الفصل الدراسي الثاني 2025'...");
    const archiveDoc = {
        fields: {
            label: toFirestoreValue("الفصل الدراسي الثاني 2025"),
            archivedAt: toFirestoreValue(new Date()),
            totalDonations: toFirestoreValue(allDonations.length),
            donationsData: toFirestoreValue(allDonations)
        }
    };

    await apiRequest(`${BASE_URL}/campaignArchives?key=${API_KEY}`, 'POST', archiveDoc);
    console.log("✅ Archive document created successfully!");

    console.log("Deleting all active donations...");
    for (const d of allDonations) {
        process.stdout.write(`  Deleting ${d.id}...`);
        try {
            await apiRequest(`${BASE_URL}/materialDonations/${d.id}?key=${API_KEY}`, 'DELETE');
            console.log(" ✅");
        } catch (e) {
            console.log(` ❌ ${e.message}`);
        }
        await sleep(200); // small delay to avoid rate limiting
    }
    console.log("\n🎉 All donations archived and cleared successfully!");
}

run().catch(e => {
    console.error("Error:", e.message);
    process.exit(1);
});
