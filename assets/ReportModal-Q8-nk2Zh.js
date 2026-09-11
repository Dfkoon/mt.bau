import{u as R,a as W,r as w,R as e,g as $,c as U,d as L}from"./index-DrLaP80S.js";const J=()=>{const C=R(),A=W(),[S,k]=w.useState(!0),[o,z]=w.useState(null),T=t=>t?String(t).replace(/\D/g,""):"",D=(t,a)=>{if(!t||!a)return!1;const n=String(t).replace(/\D/g,""),s=String(a).replace(/\D/g,"");if(n===s)return!0;const d=n.startsWith("962")?n.substring(3):n.startsWith("0")?n.substring(1):n,u=s.startsWith("962")?s.substring(3):s.startsWith("0")?s.substring(1):s;return d===u},b=t=>{if(!t||t==="—")return"—";try{const a=typeof t=="object"&&t.seconds?new Date(t.seconds*1e3):new Date(t);return isNaN(a.getTime())?String(t):a.toLocaleDateString("ar-JO",{day:"numeric",month:"long",year:"numeric"})}catch{return String(t)}},j=t=>{if(!t||t==="—")return"—";try{const a=typeof t=="object"&&t.seconds?new Date(t.seconds*1e3):new Date(t);if(isNaN(a.getTime()))return String(t);let n=a.getHours();const s=String(a.getMinutes()).padStart(2,"0"),d=n>=12?"م":"ص";n=n%12,n=n||12;const u=`${n}:${s} ${d}`;return`${a.toLocaleDateString("ar-JO",{day:"numeric",month:"long",year:"numeric"})} - ${u}`}catch{return String(t)}};w.useEffect(()=>{(async()=>{k(!0);try{const a=window.location.hash,n=a.includes("?")?a.split("?")[1]:"",s=new URLSearchParams(n),d=s.get("phone")||"",u=s.get("type")||"donor",x=T(d),P=(await $(U(L,"materialDonations"))).docs.map(r=>({id:r.id,...r.data()}));let h=0,v=0,E=0;const g=[];let c=null,f="—",F=!1;P.forEach(r=>{if(D(r.phoneNumber,x)){f==="—"&&r.studentName&&(f=r.studentName);const l=r.createdAt;if(l){const i=l.seconds?new Date(l.seconds*1e3):new Date(l);(!c||i<c)&&(c=i)}r.materials&&Array.isArray(r.materials)&&r.materials.forEach(i=>{const p=i.status||r.status,m=r.createdAt;p==="pending"||p==="approved"?(h++,g.push({name:i.name,classification:"مادة مختبرع بها",actionDate:m,deliveryDate:"—",statusText:"متاح",badgeClass:"donated"})):p==="reserved"?(v++,g.push({name:i.name,classification:"مادة مختبرع بها",actionDate:i.takerInfo?.bookedAt||r.lastUpdated||m,deliveryDate:"—",statusText:"بانتظار التسليم",badgeClass:"reserved"})):p==="completed"&&(E++,g.push({name:i.name,classification:"مادة مختبرع بها",actionDate:i.takerInfo?.bookedAt||m,deliveryDate:i.takerInfo?.deliveredAt||r.lastUpdated||m,statusText:"تم التسليم",badgeClass:"delivered"}))})}r.materials&&Array.isArray(r.materials)&&r.materials.forEach(l=>{if(l.takerInfo&&D(l.takerInfo.phone,x)){f==="—"&&l.takerInfo.name&&(f=l.takerInfo.name);const i=l.takerInfo.bookedAt||r.lastUpdated||r.createdAt;if(i){const m=i.seconds?new Date(i.seconds*1e3):new Date(i);(!c||m<c)&&(c=m)}const p=l.status;p==="reserved"?(v++,F=!0,g.push({name:l.name,classification:"مادة محجوز",actionDate:i,deliveryDate:"—",statusText:"بانتظار التسليم",badgeClass:"reserved"})):p==="completed"&&(E++,g.push({name:l.name,classification:"مادة مسلَّم",actionDate:i,deliveryDate:l.takerInfo.deliveredAt||r.lastUpdated||r.createdAt,statusText:"تم التسليم",badgeClass:"delivered"}))}})});let y="لا يوجد حجز نشط";F?y="لديه حجز نشط":h>0&&(y="مختبرع نششط"),z({reportNo:d||x,studentName:f,phone:d,registrationDate:c?b(c):"—",statusText:y,donatedCount:h,reservedCount:v,deliveredCount:E,items:g})}catch(a){console.error("Error loading report details:",a)}finally{k(!1)}})()},[A]);const B=()=>{window.print()},N=()=>{window.history.length>1?C(-1):window.close()},I=t=>{if(!t)return"#";const a=String(t.phone).replace(/\D/g,""),n=a.startsWith("0")?"962"+a.substring(1):a.startsWith("962")?a:"962"+a,s=`مرحباً ${t.studentName}، معك فريق مكانك الجامعي 🎓
نتواصل معك بصوص حمل تبادل المواد
ليك كشف بالمواد 📋
شكراً لتعاملك معنا 💙`;return`https://wa.me/${n}?text=${encodeURIComponent(s)}`};return S?e.createElement("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"#F6F4EE",fontFamily:"Tajawal, sans-serif"}},e.createElement("div",{style:{textAlign:"center",color:"#1B2A3C"}},e.createElement("div",{style:{fontSize:24,fontWeight:"bold",marginBottom:12}},"جاري تحميل الكشف..."),e.createElement("div",{style:{fontSize:16,opacity:.7}},"يرجى الانتظار قليلاً"))):o?e.createElement("div",{className:"report-container"},e.createElement("style",null,`
                :root {
                    --ink: #1B2A3C;
                    --ink-light: #2E4258;
                    --gold: #C0302E;
                    --gold-soft: #FFE4E4;
                    --bg: #F6F4EE;
                    --card: #FFFFFF;
                    --slate: #5C6B7A;
                    --line: #E4E0D4;
                    --status-donated-bg: #E8F1F1;
                    --status-donated-text: #155E68;
                    --status-reserved-bg: #FBF0DC;
                    --status-reserved-text: #8A5E14;
                    --status-delivered-bg: #E9F3EB;
                    --status-delivered-text: #2E6B3F;
                }
                body {
                    background: var(--bg);
                    font-family: 'IBM Plex Sans Arabic', sans-serif;
                    color: var(--ink);
                    margin: 0;
                    padding: 0;
                }
                .report-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 36px 16px;
                    background: var(--bg);
                    min-height: 100vh;
                    direction: rtl;
                    box-sizing: border-box;
                    width: 100%;
                }
                .sheet {
                    width: 100%;
                    max-width: 880px;
                    background: var(--card);
                    border-radius: 14px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(27,42,60,0.08), 0 12px 34px rgba(27,42,60,0.10);
                    position: relative;
                    box-sizing: border-box;
                }
                .accent-bar { height: 6px; background: linear-gradient(90deg, #8B0000 0%, #C0302E 50%, rgba(192,48,46,0.25) 100%); }
                .whatsapp-link {
                    color: var(--ink);
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    transition: color 0.2s;
                }
                .whatsapp-link:hover {
                    color: #25D366;
                    text-decoration: underline;
                }
                .whatsapp-link .wa-icon {
                    font-size: 15px;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                .whatsapp-link:hover .wa-icon { opacity: 1; }
                
                header {
                    background: var(--ink) !important;
                    color: #fff !important;
                    padding: 28px 36px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 20px;
                }
                header * {
                    color: #fff !important;
                }
                header .title-block {
                    text-align: right;
                }
                header .title-block h1 {
                    font-family: 'Tajawal', sans-serif !important;
                    font-weight: 700 !important;
                    font-size: 24px !important;
                    margin: 0 0 6px !important;
                    letter-spacing: 0.2px !important;
                    text-align: right !important;
                    color: #FFFFFF !important;
                }
                header .title-block p {
                    margin: 0 !important;
                    font-size: 13px !important;
                    color: #C7D0DA !important;
                    text-align: right !important;
                }
                header .meta {
                    text-align: left !important;
                    font-size: 12.5px !important;
                    color: #C7D0DA !important;
                    line-height: 1.9 !important;
                    white-space: nowrap !important;
                }
                header .meta div {
                    text-align: left !important;
                }
                header .meta b { color: #fff !important; font-weight: 600 !important; }
                header .meta .report-no {
                    display: inline-block !important;
                    background: rgba(255,255,255,0.08) !important;
                    border: 1px solid rgba(255,255,255,0.18) !important;
                    border-radius: 6px !important;
                    padding: 3px 10px !important;
                    font-family: 'IBM Plex Sans Arabic', sans-serif !important;
                    font-weight: 600 !important;
                    color: var(--gold-soft) !important;
                }
                .pilgrim {
                    padding: 24px 36px 8px;
                    display: flex;
                    gap: 28px;
                    flex-wrap: wrap;
                }
                .pilgrim-field { min-width: 150px; text-align: right; }
                .pilgrim-field span {
                    display: block;
                    font-size: 11.5px;
                    color: var(--slate);
                    margin-bottom: 4px;
                }
                .pilgrim-field b {
                    font-family: 'Tajawal', sans-serif;
                    font-weight: 700;
                    font-size: 17px;
                    color: var(--ink);
                }
                .stats {
                    display: grid;
                    grid-template-columns: repeat(3,1fr);
                    gap: 14px;
                    padding: 20px 36px 4px;
                }
                .stat-card {
                    border: 1px solid var(--line);
                    border-radius: 10px;
                    padding: 14px 16px;
                    text-align: center;
                    background: #FCFBF8;
                }
                .stat-card .num {
                    font-family: 'Tajawal', sans-serif;
                    font-weight: 900;
                    font-size: 26px;
                    line-height: 1;
                    margin-bottom: 6px;
                }
                .stat-card.donated .num { color: var(--status-donated-text); }
                .stat-card.reserved .num { color: var(--status-reserved-text); }
                .stat-card.delivered .num { color: var(--status-delivered-text); }
                .stat-card .lbl { font-size: 12.5px; color: var(--slate); }

                .section-title {
                    padding: 22px 36px 10px;
                    font-family: 'Tajawal', sans-serif;
                    font-weight: 700;
                    font-size: 15.5px;
                    color: var(--ink);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .section-title::before {
                    content: "";
                    width: 4px;
                    height: 16px;
                    background: var(--gold);
                    border-radius: 2px;
                    display: inline-block;
                }
                table {
                    width: calc(100% - 72px);
                    margin: 0 36px 8px;
                    border-collapse: collapse;
                    font-size: 13.5px;
                }
                thead th {
                    background: #F1EFE7;
                    color: var(--ink);
                    font-family: 'Tajawal', sans-serif;
                    font-weight: 700;
                    text-align: right;
                    padding: 11px 12px;
                    border-bottom: 2px solid var(--line);
                    white-space: nowrap;
                }
                thead th:first-child { text-align: center; width: 40px; }
                tbody td {
                    padding: 11px 12px;
                    border-bottom: 1px solid var(--line);
                    color: var(--ink-light);
                    vertical-align: middle;
                    text-align: right;
                }
                tbody td:first-child { text-align: center; color: var(--slate); font-weight: 600; }
                tbody tr:last-child td { border-bottom: none; }
                tbody tr:nth-child(even) { background: #FCFBF8; }

                .badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    white-space: nowrap;
                }
                .badge.donated { background: var(--status-donated-bg); color: var(--status-donated-text); }
                .badge.reserved { background: var(--status-reserved-bg); color: var(--status-reserved-text); }
                .badge.delivered { background: var(--status-delivered-bg); color: var(--status-delivered-text); }

                .empty-row td {
                    text-align: center;
                    color: var(--slate);
                    font-style: normal;
                    padding: 16px;
                }
                .perforation {
                    margin: 22px 36px 0;
                    border-top: 1.5px dashed var(--line);
                    position: relative;
                }
                .perforation::before, .perforation::after {
                    content: "";
                    position: absolute;
                    top: -9px;
                    width: 18px; height: 18px;
                    background: var(--bg);
                    border-radius: 50%;
                }
                .perforation::before { right: -27px; }
                .perforation::after { left: -27px; }

                footer {
                    padding: 18px 36px 26px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                footer .note {
                    font-size: 12px;
                    color: var(--slate);
                    line-height: 1.8;
                    max-width: 480px;
                    text-align: right;
                }
                footer .system {
                    font-size: 11.5px;
                    color: var(--slate);
                    text-align: left;
                }
                footer .system b { color: var(--ink); font-family: 'Tajawal', sans-serif; }

                .ribbon {
                    position: absolute;
                    top: 18px;
                    left: -42px;
                    transform: rotate(-45deg);
                    background: linear-gradient(135deg, #8B0000, #C0302E);
                    color: #fff;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 4px 46px;
                    font-family: 'Tajawal', sans-serif;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }
                .actions {
                    max-width: 880px;
                    width: 100%;
                    margin: 16px auto 0;
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                }
                .btn {
                    font-family: 'IBM Plex Sans Arabic', sans-serif;
                    font-weight: 600;
                    font-size: 13.5px;
                    padding: 10px 20px;
                    border-radius: 8px;
                    border: 1px solid var(--line);
                    background: var(--card);
                    color: var(--ink);
                    cursor: pointer;
                }
                .btn.primary {
                    background: var(--ink);
                    color: #fff;
                    border-color: var(--ink);
                }
                
                @media print {
                    @page {
                        margin: 0 !important;
                    }
                    /* Hide everything else on the page */
                    body * {
                        visibility: hidden !important;
                    }
                    .report-container, .report-container * {
                        visibility: visible !important;
                    }
                    .report-container {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        padding: 1.5cm !important;
                        margin: 0 !important;
                        background: #fff !important;
                        box-sizing: border-box !important;
                    }
                    .sheet {
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        border: none !important;
                    }
                    .actions {
                        display: none !important;
                    }
                    /* Reset parent containers */
                    html, body, #root, .app-container, main {
                        height: auto !important;
                        min-height: 0 !important;
                        overflow: visible !important;
                        position: static !important;
                        background: #fff !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .perforation::before, .perforation::after {
                        background: #fff !important;
                    }
                }

                
                @media (max-width: 640px) {
                    header { flex-direction: column; }
                    header .meta { text-align: right; }
                    .stats { grid-template-columns: 1fr; }
                    table { font-size: 12px; }
                }
            `),e.createElement("div",{className:"sheet"},e.createElement("div",{className:"ribbon"},"إلكتروني"),e.createElement("div",{className:"accent-bar"}),e.createElement("header",null,e.createElement("div",{className:"title-block"},e.createElement("h1",null,"كشف حرك المواد"),e.createElement("p",null,"تقرير تفصيلي بالمواد المختبرع بها والمحجوز والمسلم لهذا الحاجز")),e.createElement("div",{className:"meta"},e.createElement("div",null,"رقم الكشف  ",e.createElement("span",{className:"report-no"},o.reportNo)),e.createElement("div",null,"تاريخخ الإصدار:  ",e.createElement("b",null,j(new Date))),e.createElement("div",null,"المنسق:  ",e.createElement("b",null,"فريق مكاتك")))),e.createElement("div",{className:"pilgrim"},e.createElement("div",{className:"pilgrim-field"},e.createElement("span",null,"اسم الحاجز"),e.createElement("b",null,o.studentName)),e.createElement("div",{className:"pilgrim-field"},e.createElement("span",null,"رقم الهاتف"),e.createElement("b",null,e.createElement("a",{className:"whatsapp-link",href:I(o),target:"_blank",rel:"noopener noreferrer",title:"فتح واتساب"},e.createElement("span",{className:"wa-icon"},"💬"),o.phone))),e.createElement("div",{className:"pilgrim-field"},e.createElement("span",null,"تاريخخ التسجيل"),e.createElement("b",null,o.registrationDate)),e.createElement("div",{className:"pilgrim-field"},e.createElement("span",null,"حال الحاجز"),e.createElement("b",{style:{color:o.reservedCount>0?"#8A5E14":"#1B2A3C"}},o.statusText))),e.createElement("div",{className:"stats"},e.createElement("div",{className:"stat-card donated"},e.createElement("div",{className:"num"},o.donatedCount),e.createElement("div",{className:"lbl"},"مواد مختبرع بها متاح")),e.createElement("div",{className:"stat-card reserved"},e.createElement("div",{className:"num"},o.reservedCount),e.createElement("div",{className:"lbl"},"مواد محجوز")),e.createElement("div",{className:"stat-card delivered"},e.createElement("div",{className:"num"},o.deliveredCount),e.createElement("div",{className:"lbl"},"مواد مسلَّم"))),e.createElement("div",{className:"section-title"},"تفاصيل المواد"),e.createElement("table",null,e.createElement("thead",null,e.createElement("tr",null,e.createElement("th",null,"م"),e.createElement("th",null,"اسم المادة"),e.createElement("th",null,"التصنيف"),e.createElement("th",null,"تاريخخ الإجراء"),e.createElement("th",null,"تاريخخ التسليم"),e.createElement("th",null,"الحال"))),e.createElement("tbody",null,o.items.length>0?o.items.map((t,a)=>e.createElement("tr",{key:a},e.createElement("td",null,a+1),e.createElement("td",null,t.name),e.createElement("td",null,t.classification),e.createElement("td",null,b(t.actionDate)),e.createElement("td",null,b(t.deliveryDate)),e.createElement("td",null,e.createElement("span",{className:`badge ${t.badgeClass}`},t.statusText)))):e.createElement("tr",{className:"empty-row"},e.createElement("td",{colSpan:"6"},"لا توجد مواد مسجل على هذا الرقم حتى الآن")),o.items.length>0&&o.donatedCount===0&&o.deliveredCount===0&&e.createElement("tr",{className:"empty-row"},e.createElement("td",{colSpan:"6"},"لا توجد مواد مختبرع بها أو مسلَّم مسجّل على هذا الرقم حتى الآن")))),e.createElement("div",{className:"perforation"}),e.createElement("footer",null,e.createElement("div",{className:"note"},"يرجى الاحتفاظ بهذا الكشف ومشاركته عند التواصل مع فريق التنسيق. هذا المستند صادر إلكترونيًا من نظام مكاتك، ولا يحتاج إلى تم أو توقيع لاعتماده."),e.createElement("div",{className:"system"},e.createElement("div",null,e.createElement("b",null,"نظام مكاتك")),e.createElement("div",null,"تقرير آلي — لا يُعتد به كوثيق رسمي بديل عن السجل الأصلي")))),e.createElement("div",{className:"actions"},e.createElement("button",{className:"btn primary",onClick:B},"🖶 طباع / حفظ PDF"),e.createElement("button",{className:"btn",onClick:N},"إغلاق"))):e.createElement("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"#F6F4EE",fontFamily:"Tajawal, sans-serif"}},e.createElement("div",{style:{textAlign:"center",color:"#1B2A3C"}},e.createElement("div",{style:{fontSize:24,fontWeight:"bold",marginBottom:12}},"عذراً، لم يتم العثور على بيانات الكشف"),e.createElement("button",{className:"btn primary",onClick:N,style:{marginTop:16}},"العود")))};export{J as default};
