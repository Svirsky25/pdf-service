import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// תיקון לשימוש ב-__dirname בתוך ES Modules (Node 20)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// אנחנו הולכים אחורה מ-src לתיקיית השורש ואז ל-assets
const imagePath = path.join(__dirname, '..', 'assets', 'spider.jpg');

try {
    if (!fs.existsSync(imagePath)) {
        console.error(`❌ הקובץ לא נמצא בנתיב: ${imagePath}`);
        process.exit(1);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // הדפסת הסטרינג המלא מוכן ל-HTML
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;
    
    console.log('--- קידוד ה-Base64 מוכן! ---');
    fs.writeFileSync(path.join(__dirname, '..', 'assets', 'spider.txt'), dataUrl);
    console.log('התוצאה נשמרה לקובץ: base64_output.txt בשורש הפרויקט');
    
} catch (error) {
    console.error('שגיאה בקריאת הקובץ:', error);
}