import type { MiddlewareHandler } from 'hono';
import { logger } from '../logs/logger';

export const loggerMiddleware: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  const requestId = c.get('requestId');
  const { method, path } = c.req;

  let payloadInfo: any = undefined;

  if (method === 'POST') {
    try {
      const body = await c.req.raw.clone().json();
      
      payloadInfo = {
        html_size_kb: body.html ? Math.round(body.html.length / 1024) : 0,
        has_images: body.html?.includes('data:image'),
        table_rows_estimate: (body.html?.match(/<tr/g) || []).length,
        pdf_format: body.pdfOptions?.format || 'A4',
      };
    } catch {
      payloadInfo = { error: "body_not_json_or_empty" };
    }
  }

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  const context = {
    requestId,
    method,
    route: path,
    status,
    took: `${duration}ms`,
    details: payloadInfo,
    mem_mb: Math.round(process.memoryUsage().rss / 1024 / 1024)
  };

  if (status >= 500) logger.error('request_finished', context);
  else if (status >= 400) logger.warn('request_finished', context);
  else logger.info('request_finished', context);
};