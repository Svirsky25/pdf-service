const COLORS = {
  reset: "\x1b[0m",
  info: "\x1b[36m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
  debug: "\x1b[90m",
};

type LogLevel = 'INFO' | 'WARN' | 'ERROR';

const log = (level: LogLevel, message: string, context: Record<string, any> = {}) => {
  const timestamp = new Date().toISOString();
  const color = COLORS[level.toLowerCase() as keyof typeof COLORS] || COLORS.reset;

  process.stdout.write(
    `${COLORS.debug}[${timestamp}]${COLORS.reset} ` +
    `${color}${level.padEnd(5)}${COLORS.reset} » ` +
    `${COLORS.reset}${message}${COLORS.reset}\n`
  );

  if (Object.keys(context).length > 0) {
    const indentedJson = JSON.stringify(context, null, 2)
      .split('\n')
      .map(line => `   ${line}`)
      .join('\n');
      
    process.stdout.write(`${COLORS.debug}${indentedJson}${COLORS.reset}\n\n`);
  }
};

export const logger = {
  info: (msg: string, ctx?: Record<string, any>) => log('INFO', msg, ctx),
  warn: (msg: string, ctx?: Record<string, any>) => log('WARN', msg, ctx),
  error: (msg: string, ctx?: Record<string, any>) => log('ERROR', msg, ctx),
};