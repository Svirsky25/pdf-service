import type { Context, Next } from "hono";

export const requestValidator = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();

    // בדיקה ישירה: האם קיים שדה html והאם הוא טקסט
    if (!body || !body.html || typeof body.html !== 'string' || body.html.trim() === '') {
      return c.html(`
        <div style="font-family: sans-serif; padding: 20px; background-color: #fff5f5; border: 1px solid #feb2b2; border-radius: 8px;" dir="rtl">
          <h2 style="color: #c53030; margin-top: 0;">❌ שגיאה בבקשה</h2>
          <p>חסר שדה <strong>html</strong> בגוף הבקשה (או שהשדה ריק).</p>
          <p style="font-size: 0.9em; color: #666;">יש לשלוח אובייקט JSON המכיל את התוכן שברצונך להפוך ל-PDF.</p>
        </div>
      `, 400);
    }

    // שמירת המידע להמשך
    c.set('pdfData', body);
    await next();
  } catch (err) {
    // מקרה שבו ה-JSON עצמו שבור (למשל חסר פסיק)
    return c.html(`
      <div style="font-family: sans-serif; padding: 20px; background-color: #fff5f5; border: 1px solid #feb2b2; border-radius: 8px;" dir="rtl">
        <h2 style="color: #c53030; margin-top: 0;">❌ שגיאת פורמט</h2>
        <p>הבקשה שנשלחה אינה בפורמט JSON תקין.</p>
      </div>
    `, 400);
  }
};