# خطة عرض وطباعة جدول قاعدة بيانات ثابتة

## الهدف
- عرض بيانات قاعدة البيانات على الموقع بشكل ثابت ولا يتغير من العرض.
- دعم طباعة الجدول بنفس التنسيق على الموقع وعلى أي موقع آخر تستخدمه.
- ضمان أن الصفحة لا تتوقف بسبب تغيرات العرض أو العرض في الطباعة.

## الفكرة العامة
1. استخدم قاعدة بيانات موثوقة (مثل Firebase Firestore، أو MySQL/PostgreSQL عبر واجهة API) بحيث تكون البيانات متاحة دائماً.
2. اعرض البيانات في جدول ثابت ومنظم مع صفوف وأعمدة واضحة.
3. أضف CSS خاص بالطباعة لتضمن بقاء الجدول نفسه عند طباعة الصفحة.
4. استخدم مكون قابل لإعادة الاستخدام في أي موقع React.
5. أضف زر طباعة يقوم باستدعاء `window.print()` ليطبع فقط الجزء المطلوب.
6. ضع دائمًا محتوى بديل أو رسالة تحميل إذا كانت البيانات لم تصل بعد.

## الملفات المضافة
- `src/components/PrintableDatabaseTable.jsx`
- `src/components/PrintableDatabaseTable.css`
- تحديث صغير في `src/index.css` لدعم قواعد الطباعة العامة

## كيف تستخدم المكون
1. استورد المكون في الصفحة أو القسم الخاص بك:

```jsx
import PrintableDatabaseTable from './components/PrintableDatabaseTable';
```

2. عرّف الأعمدة والصفوف:

```js
const columns = [
  { field: 'name', label: 'الاسم' },
  { field: 'department', label: 'القسم' },
  { field: 'grade', label: 'الدرجة' },
];

const rows = [
  { id: 1, name: 'محمد', department: 'هندسة', grade: 'A' },
  { id: 2, name: 'علي', department: 'تجارة', grade: 'B+' },
];
```

3. استخدم المكون:

```jsx
<PrintableDatabaseTable
  title="بيانات الطلاب"
  subtitle="يمكنك طباعة هذا الجدول بنفس التنسيق"
  columns={columns}
  rows={rows}
/>
```

## مثال على جلب البيانات من قاعدة بيانات Firebase

```js
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from './config/firebase';

const db = getFirestore(firebaseApp);

export async function fetchStudentRecords() {
  const snapshot = await getDocs(collection(db, 'students'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

ثم تمرّر `rows` الناتجة إلى `PrintableDatabaseTable`.

## نصائح لجعل الموقع لا يتوقف
- استخدم معالجة الأخطاء عند جلب البيانات.
- أضف رسالة تحميل مثل "جاري التحميل..." قبل وصول البيانات.
- استخدم `try/catch` لتجنب توقف الصفحة عند فشل الاتصال.
- إذا كنت تستخدم Firebase، فعّّل `offline persistence` إذا كان مطلوباً.

## قواعد الطباعة في CSS
- إخفاء عناصر التحكم غير المرغوب فيها أثناء الطباعة (`.no-print`).
- فرض عرض الجدول بالكامل خلال الطباعة.
- إزالة الظلال والخلفيات الثقيلة للطباعة.
- استخدام ألوان بسيطة وواضحة.

## لماذا هذا الحل مفيد لموقع آخر أيضاً
- المكون منفصل ويمكن نسخه إلى أي مشروع React آخر.
- CSS الطباعة يمكن إعادة استخدامها بسهولة.
- التخطيط يعتمد على بيانات ديناميكية لكن الشكل ثابت.
- يمكن تعديل الأعمدة لتناسب أي جدول بيانات.

## ملاحظات إضافية
- إذا أردت استخدام هذا المكون في موقع آخر غير React، يمكنك نقل HTML وCSS فقط وتستبدل منطق جلب البيانات بأي تقنية أخرى.
- تأكد من أن خطة قاعدة البيانات تتضمن نسخ احتياطية وأذونات قراءة/كتابة مرتبة.
