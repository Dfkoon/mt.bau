import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc, onSnapshot, collection } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useLanguage } from '../../contexts/LanguageContext';

const fmtDate = (timestamp) => {
    if (!timestamp) return '—';
    const d = new Date(timestamp);
    return d.toLocaleDateString('ar-JO') + ' ' + d.toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' });
};

const AdminCoordinators = () => {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Global configurations for staff passwords & secrets
    const [settings, setSettings] = useState({});

    // Live staff online status from Firestore staff_status collection
    const [staffStatus, setStaffStatus] = useState({});

    // Editing modal state
    const [selectedStaff, setSelectedStaff] = useState(null); // 'admin', 'ahmad', 'sara'
    const [editForm, setEditForm] = useState({ nameAr: '', nameEn: '', email: '', password: '' });

    // Load static details & passwords on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, 'system_configs', 'global_settings');
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setSettings(snap.data());
                }
            } catch (err) {
                console.error("Failed to load staff settings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();

        // Listen to live staff status real-time
        const unsubStatus = onSnapshot(collection(db, 'staff_status'), (snap) => {
            const statusMap = {};
            snap.docs.forEach(d => {
                statusMap[d.id] = d.data();
            });
            setStaffStatus(statusMap);
        });

        return () => unsubStatus();
    }, []);

    // 2FA Reset Handler
    const handleReset2fa = async (staffKey) => {
        if (!window.confirm(isAr 
            ? `هل تريد بالتأكيد إلغاء وإعادة تعيين رمز التحقق الثنائي (2FA) لـ ${staffKey}؟` 
            : `Are you sure you want to reset 2FA for ${staffKey}?`
        )) return;

        setSaving(true);
        try {
            const secretField = `${staffKey}2faSecret`;
            const confirmedField = `${staffKey}QrConfirmed`;
            const requestField = `${staffKey}ResetRequest`;

            const updateData = {
                [secretField]: '',
                [confirmedField]: false,
                [requestField]: false
            };

            await updateDoc(doc(db, 'system_configs', 'global_settings'), updateData);
            setSettings(prev => ({ ...prev, ...updateData }));
            toast.success(isAr ? 'تم إعادة تعيين الـ 2FA بنجاح. سيُطلب من الموظف مسح الكود مجدداً عند أول تسجيل دخول.' : '2FA Reset successfully.');
        } catch (err) {
            console.error("Failed to reset 2FA:", err);
            toast.error(isAr ? 'فشل إعادة التعيين' : 'Reset failed');
        } finally {
            setSaving(false);
        }
    };

    // Update coordinator parameters
    const handleOpenEdit = (key) => {
        setSelectedStaff(key);
        if (key === 'admin') {
            setEditForm({
                nameAr: 'الأدمن الرئيسي',
                nameEn: 'Main Admin',
                email: 'admin@koon.bau.jo',
                password: settings.adminPassword || 'admin2024'
            });
        } else if (key === 'ahmad') {
            setEditForm({
                nameAr: settings.ahmadNameAr || 'أحمد',
                nameEn: settings.ahmadNameEn || 'Ahmad',
                email: settings.ahmadEmail || '',
                password: settings.ahmadPassword || 'ahmad2024'
            });
        } else if (key === 'sara') {
            setEditForm({
                nameAr: settings.saraNameAr || 'سارة',
                nameEn: settings.saraNameEn || 'Sara',
                email: settings.saraEmail || '',
                password: settings.saraPassword || 'sara2024'
            });
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedStaff) return;
        setSaving(true);
        try {
            const updateData = {};
            if (selectedStaff === 'admin') {
                updateData.adminPassword = editForm.password;
            } else {
                updateData[`${selectedStaff}NameAr`] = editForm.nameAr;
                updateData[`${selectedStaff}NameEn`] = editForm.nameEn;
                updateData[`${selectedStaff}Email`] = editForm.email;
                updateData[`${selectedStaff}Password`] = editForm.password;
            }

            await updateDoc(doc(db, 'system_configs', 'global_settings'), updateData);
            setSettings(prev => ({ ...prev, ...updateData }));
            toast.success(isAr ? 'تم تحديث بيانات المنسق بنجاح!' : 'Coordinator details updated!');
            setSelectedStaff(null);
        } catch (err) {
            console.error(err);
            toast.error(isAr ? 'فشل حفظ التعديلات' : 'Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading-container">
                <div className="admin-spinner" />
                <p>{isAr ? 'جاري تحميل لوحة إدارة المنسقين...' : 'Loading coordinator panel...'}</p>
            </div>
        );
    }

    const staffList = [
        {
            key: 'admin',
            role: 'admin',
            name: isAr ? 'الأدمن (لوحة التحكم)' : 'Administrator',
            email: 'admin@koon.bau.jo',
            totpEnabled: !!settings.admin2faSecret,
            resetRequested: !!settings.adminResetRequest,
        },
        {
            key: 'ahmad',
            role: 'coordinator',
            name: isAr ? (settings.ahmadNameAr || 'أحمد') : (settings.ahmadNameEn || 'Ahmad'),
            email: settings.ahmadEmail || 'makanak.ahmad@gmail.com',
            totpEnabled: !!settings.ahmad2faSecret,
            resetRequested: !!settings.ahmadResetRequest,
        },
        {
            key: 'sara',
            role: 'coordinator',
            name: isAr ? (settings.saraNameAr || 'سارة') : (settings.saraNameEn || 'Sara'),
            email: settings.saraEmail || 'makanak.sara@gmail.com',
            totpEnabled: !!settings.sara2faSecret,
            resetRequested: !!settings.saraResetRequest,
        }
    ];

    return (
        <div className="admin-panel-section admin-fade-in" style={{ direction: 'rtl', textAlign: 'right' }}>
            <h3 className="admin-section-title">👥 <span>{isAr ? 'إدارة المنسقين وأمن الحسابات' : 'Coordinators & Account Security'}</span></h3>
            
            <div className="coordinators-grid">
                {staffList.map((staff) => {
                    const status = staffStatus[staff.key] || {};
                    const isOnline = status.online && (Date.now() - (status.lastSeen || 0) < 60000);

                    return (
                        <div key={staff.key} className="coordinator-profile-card admin-glass-card">
                            <div className="profile-header">
                                <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`} />
                                <div className="profile-titles">
                                    <h4>{staff.name}</h4>
                                    <span className="role-tag">{staff.role === 'admin' ? (isAr ? 'مشرف رئيسي' : 'Admin') : (isAr ? 'منسق ميداني' : 'Coordinator')}</span>
                                </div>
                            </div>

                            <hr className="profile-divider" />

                            <div className="profile-body">
                                <div className="meta-row">
                                    <span>📧 {isAr ? 'البريد الإلكتروني:' : 'Email:'}</span>
                                    <strong>{staff.email}</strong>
                                </div>
                                <div className="meta-row">
                                    <span>🔒 {isAr ? 'التحقق الثنائي (2FA):' : '2FA Status:'}</span>
                                    <strong style={{ color: staff.totpEnabled ? '#55efc4' : '#ff7675' }}>
                                        {staff.totpEnabled ? (isAr ? 'مفعّل ونشط' : 'Enabled') : (isAr ? 'غير مفعّل' : 'Disabled')}
                                    </strong>
                                </div>
                                <div className="meta-row">
                                    <span>⏳ {isAr ? 'آخر تسجيل دخول:' : 'Last Login:'}</span>
                                    <strong>{fmtDate(status.lastLogin)}</strong>
                                </div>
                            </div>

                            <hr className="profile-divider" />

                            {staff.resetRequested && (
                                <div className="reset-alert-box">
                                    ⚠️ {isAr ? 'طلب إعادة تعيين رمز 2FA معلق!' : '2FA reset requested!'}
                                </div>
                            )}

                            <div className="profile-actions-row">
                                <button 
                                    className="admin-action-btn edit-q" 
                                    onClick={() => handleOpenEdit(staff.key)}
                                    disabled={saving}
                                >
                                    ✏️ {isAr ? 'تعديل البيانات' : 'Edit'}
                                </button>

                                <button 
                                    className={`admin-action-btn ${staff.resetRequested ? 'decline' : 'resolve'}`}
                                    onClick={() => handleReset2fa(staff.key)}
                                    disabled={saving}
                                >
                                    🔄 {isAr ? 'إعادة تعيين 2FA' : 'Reset 2FA'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* EDIT PROFILE MODAL */}
            {selectedStaff && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-card">
                        <div className="admin-modal-header">
                            <h4>✏️ {isAr ? `تحديث بيانات: ${selectedStaff}` : `Edit: ${selectedStaff}`}</h4>
                            <button className="close-btn" onClick={() => setSelectedStaff(null)}>&times;</button>
                        </div>
                        <div className="admin-modal-body">
                            {selectedStaff !== 'admin' && (
                                <>
                                    <div className="qedit-field">
                                        <label className="qedit-label">{isAr ? 'الاسم بالعربية:' : 'Name (Arabic):'}</label>
                                        <input
                                            type="text"
                                            className="admin-input-field"
                                            value={editForm.nameAr}
                                            onChange={e => setEditForm({ ...editForm, nameAr: e.target.value })}
                                        />
                                    </div>
                                    <div className="qedit-field" style={{ marginTop: '1rem' }}>
                                        <label className="qedit-label">{isAr ? 'الاسم بالإنجليزية:' : 'Name (English):'}</label>
                                        <input
                                            type="text"
                                            className="admin-input-field"
                                            value={editForm.nameEn}
                                            onChange={e => setEditForm({ ...editForm, nameEn: e.target.value })}
                                            dir="ltr"
                                        />
                                    </div>
                                    <div className="qedit-field" style={{ marginTop: '1rem' }}>
                                        <label className="qedit-label">{isAr ? 'البريد الإلكتروني:' : 'Email Address:'}</label>
                                        <input
                                            type="email"
                                            className="admin-input-field"
                                            value={editForm.email}
                                            onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                            dir="ltr"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="qedit-field" style={{ marginTop: '1rem' }}>
                                <label className="qedit-label">{isAr ? 'كلمة المرور الجديدة:' : 'New Password:'}</label>
                                <input
                                    type="text"
                                    className="admin-input-field"
                                    value={editForm.password}
                                    onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                                    dir="ltr"
                                />
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button type="button" className="admin-action-btn approve" onClick={handleSaveEdit} disabled={saving}>
                                {isAr ? 'حفظ البيانات' : 'Save'}
                            </button>
                            <button type="button" className="admin-action-btn decline" onClick={() => setSelectedStaff(null)} disabled={saving}>
                                {isAr ? 'إلغاء' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCoordinators;
