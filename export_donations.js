import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCwEYy_wNXXmvq_jDHD-8xvD90ZEVUwHVA",
    authDomain: "koon-609da.firebaseapp.com",
    projectId: "koon-609da",
    storageBucket: "koon-609da.firebasestorage.app",
    messagingSenderId: "999499144055",
    appId: "1:999499144055:web:de58d0ab0b1dcc11b05f72"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
    const snap = await getDocs(collection(db, 'materialDonations'));
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    const archiveData = {
        label: "الفصل الدراسي الثاني 2025",
        archivedAt: new Date().toISOString(),
        totalDonations: all.length,
        donationsData: all.map(d => ({
            id: d.id || '',
            studentName: d.studentName || '',
            phoneNumber: d.phoneNumber || '',
            studentGender: d.studentGender || '',
            status: d.status || '',
            materials: (d.materials || []).map(m => {
                if (typeof m === 'object' && m !== null) {
                    return {
                        name: m.name || '',
                        description: m.description || '',
                        status: m.status || 'pending',
                        takerInfo: m.takerInfo ? {
                            name: m.takerInfo.name || '',
                            phone: m.takerInfo.phone || '',
                            gender: m.takerInfo.gender || ''
                        } : null
                    };
                }
                return { name: String(m), description: '', status: 'pending', takerInfo: null };
            }),
            createdAt: d.createdAt ? String(d.createdAt) : new Date().toISOString()
        }))
    };

    // Write to file for Firebase import
    import('fs').then(fs => {
        fs.writeFileSync('./archive_data.json', JSON.stringify(archiveData, null, 2));
        console.log(`Exported ${all.length} donations to archive_data.json`);
    });
}

run().catch(console.error);
