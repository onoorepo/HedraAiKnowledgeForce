# دليل تشغيل ونشر مشروع HedraAiKnowledge (HAK)

هذا الدليل يحتوي على خطوات تفصيلية لتشغيل المشروع على بيئة التطوير (ويندوز 11)، وتوضيح كيفية رفعه وتشغيله على خادم إنتاجي (Webmin VPS).

---

## الجزء الأول: كيفية تشغيل المشروع على Windows 11 (Localhost - VSCode)

### 1 والمتطلبات الأساسية (Prerequisites)
1. **Node.js**: قم بتحميل وتثبيت الإصدار الأخير (LTS) من [الموقع الرسمي](https://nodejs.org/).
2. **Git**: لتحميل الكود المصدري (اختياري لو قمت بتحميله كملف مضغوط) [Git for Windows](https://git-scm.com/).
3. **VSCode**: بيئة التطوير من [هنا](https://code.visualstudio.com/).
4. **MySQL**: يمكنك تحميل [XAMPP](https://www.apachefriends.org/) لإنشاء قاعدة بيانات محلية بسهولة، أو تثبيت MySQL Server المستقل.

### 2. تجهيز قاعدة البيانات
1. قم بتشغيل لوحة تحكم XAMPP واضغط على "Start" بجوار Apache و MySQL.
2. افتح المتصفح وادخل إلى `http://localhost/phpmyadmin`.
3. قم بإنشاء قاعدة بيانات جديدة باسم `hak_db` (ترميز `utf8mb4_unicode_ci`).

### 3. إعداد المشروع
1. افتح مجلد المشروع باستخدام **VS Code**.
2. افتح الـ Terminal بداخل VS Code (`Ctrl + ~`).
3. قم بتثبيت الحزم البرمجية بكتابة الأمر التالي:
   ```bash
   npm install
   ```

### 4. إعداد متغيرات البيئة (.env)
1. قم بإنشاء ملف باسم `.env` في المسار الرئيسي للمشروع.
2. أضف الإعدادات التالية داخله:
   ```env
   # إعدادات قاعدة البيانات (غيّر root و الباسورد لو لديك باسورد مختلف)
   DATABASE_URL="mysql://root:@localhost:3306/hak_db"

   # مفتاح تشفير الخزنة (يجب أن يكون 32 حرف)
   ENCRYPTION_KEY="12345678901234567890123456789012"

   # مفاتيح الذكاء الاصطناعي و Pinecone (أضف مفاتيحك الحقيقية هنا)
   GEMINI_API_KEY="your-gemini-key-here"
   PINECONE_API_KEY="your-pinecone-key"
   PINECONE_ENVIRONMENT="gcp-starter"
   ```

### 5. رفع مخطط قاعدة البيانات (Prisma)
في الـ Terminal، اكتب الأوامر التالية لإنشاء الجداول في MySQL:
```bash
npx prisma generate
npx prisma db push
```

### 6. تشغيل المشروع
للعمل على وضع التطوير (Development):
```bash
npm run dev
```
سيفتح المشروع على الرابط: `http://localhost:3000`

---

## الجزء الثاني: كيفية رفع وتشغيل المشروع على خادم Webmin VPS

يفترض هذا الدليل أن الخادم يعمل بنظام **Ubuntu/Debian** وأن لديك وصول کـ `root` أو `sudo` من خلال الـ SSH، ولوحة تحكم Webmin مثبتة.

### 1. تجهيز الخادم (Server Setup) من خلال الـ SSH
افتح الـ Terminal (أو PuTTY في ويندوز) وادخل إلى خادمك:
```bash
ssh root@your_server_ip
```

قم بتحديث النظام وتثبيت `Node.js` و `npm` و `PM2` (لإبقاء التطبيق يعمل في الخلفية):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git
sudo npm install -g pm2
```

### 2. تجهيز قاعدة بيانات MySQL عبر Webmin
1. سجل الدخول إلى لوحة تحكم **Webmin**.
2. اذهب إلى **Servers > MySQL Database Server**.
3. قم بإنشاء قاعدة بيانات جديدة باسم `hak_db_prod`.
4. قم بإنشاء مستخدم جديد (مثلاً `hak_user`) مع تعيين كلمة مرور قوية وإعطائه صلاحيات كاملة على قاعدة `hak_db_prod`.

### 3. رفع ملفات المشروع
يمكنك رفع الملفات عبر **File Manager** الخاص بـ Webmin إلى مسار مثل `/var/www/hak` (تأكد من عدم رفع مجلد `node_modules`).
أو الأفضل عبر Git أو SFTP.

### 4. تثبيت الحزم وإعداد البيئة
من خلال الـ SSH، انتقل لمجلد المشروع:
```bash
cd /var/www/hak
```
ثبت الحزم:
```bash
npm install
```
قم بإنشاء ملف `.env`:
```bash
nano .env
```
وأضف بيانات الـ Production الخاصة بالـ VPS:
```env
DATABASE_URL="mysql://hak_user:YOUR_PASSWORD@127.0.0.1:3306/hak_db_prod"
ENCRYPTION_KEY="your-highly-secure-32-char-key-here"
GEMINI_API_KEY="your-api-key"
PINECONE_API_KEY="your-pinecone-key"
```

### 5. بناء التطبيق (Build)
قم برفع مخطط البيانات وبناء مشروع Next.js:
```bash
npx prisma generate
npx prisma db push
npm run build
```

### 6. تشغيل المشروع باستخدام PM2
لبدء تشغيل التطبيق في الخلفية وجعله يعمل حتى بعد إعادة تشغيل السيرفر:
```bash
pm2 start npm --name "hak-ai" -- start
pm2 save
pm2 startup
```
*سيعمل التطبيق الآن على المنفذ `3000` داخل السيرفر.*

### 7. إعداد Webmin / Nginx Reverse Proxy (لربط الدومين)
لجعل المشروع يفتح من خلال الدومين الخاص بك (مثلاً `ai.yourdomain.com`) بدون منفذ `3000`:
1. في **Webmin** اذهب إلى **Servers > Nginx Webserver**.
2. أنشئ Vhost (ملف كونسول جديد) للدومين الخاص بك.
3. قم بتعديل ملف الإعدادات ليحتوي على الـ Proxy الآتي:
   ```nginx
   server {
       listen 80;
       server_name ai.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
4. اعمل Restart لـ Nginx:
   ```bash
   sudo systemctl restart nginx
   ```
   **الآن يمكنك تصفح مشروعك عبر دومينك الخاص!** 🚀
