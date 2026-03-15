import type { MiddlewareHandler } from 'hono';
import { logger } from '../logs/logger.js';

export const loggerMiddleware: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  const requestId = c.get('requestId') || 'unknown';
  const { method, path } = c.req;

  // צילום מצב משאבים התחלתית
  const startCpuUsage = process.cpuUsage();
  const startMem = process.memoryUsage().rss;

  let payloadInfo: any = {};

  // חילוץ מידע מה-Body רק בפוסט ל-PDF
  if (method === 'POST' && path.includes('/generate')) {
    try {
      const body = await c.req.raw.clone().json();
      payloadInfo = {
        html_size_kb: body.html ? Math.round(body.html.length / 1024) : 0,
        has_images: body.html?.includes('<img') || body.html?.includes('data:image'),
        table_rows_count: (body.html?.match(/<tr/g) || []).length,
        pdf_page_format: body.pdfOptions?.format || 'A4',
      };
    } catch {
      payloadInfo = { error: "invalid_json_body" };
    }
  }

  await next();

  // חישוב מטריקות בסיום
  const durationMs = Date.now() - start;
  const endCpuUsage = process.cpuUsage(startCpuUsage);
  const endMem = process.memoryUsage().rss;
  const status = c.res.status;

  const cpuTimeMs = (endCpuUsage.user + endCpuUsage.system) / 1000;
  const cpuUsagePercent = durationMs > 0 ? Number(((cpuTimeMs / durationMs) * 100).toFixed(1)) : 0;

  // בניית האובייקט המאורגן תחת metrics
  const context = {
    request_id: requestId,
    method,
    path,
    status,
    payload: {
      input_html_size_kb: payloadInfo.html_size_kb || 0,
      input_table_rows: payloadInfo.table_rows_count || 0,
      output_pdf_format: payloadInfo.pdf_page_format || 'A4',
      contains_images: payloadInfo.has_images || false
    },
    metrics: {
      // זמן וביצועים
      latency_ms: durationMs,
      cpu_process_time_ms: Number(cpuTimeMs.toFixed(2)),
      cpu_usage_percentage: cpuUsagePercent,
      
      // זיכרון (RAM)
      memory_used_total_mb: Math.round(endMem / 1024 / 1024),
      memory_consumed_by_request_mb: Math.round((endMem - startMem) / 1024 / 1024),
    }
  };

  const logMsg = `request_finished | ${method} ${path} | ${status} | ${durationMs}ms`;

  if (status >= 500) {
    logger.error(logMsg, context);
  } else if (status >= 400) {
    logger.warn(logMsg, context);
  } else {
    logger.info(logMsg, context);
  }
};