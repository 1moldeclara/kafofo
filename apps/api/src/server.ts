import { buildApp } from './app.js';
import { readConfig } from './config.js';
import { createDatabase } from './database/client.js';
import { createLogger } from './logger.js';

const config = readConfig(process.env);
const logger = createLogger(config.logLevel);
const database = config.databaseUrl
  ? createDatabase(config.databaseUrl, () => logger.error('Falha em conexão ociosa do PostgreSQL.'))
  : undefined;
const app = await buildApp({ logger, ...(database ? { database } : {}) });

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void app.close().catch(() => {
      logger.error('Falha ao encerrar a API.');
      process.exitCode = 1;
    });
  });
}

try {
  await app.listen({ host: config.host, port: config.port });
} catch (error) {
  logger.error({ err: error }, 'Falha ao iniciar a API');
  await app.close();
  process.exitCode = 1;
}
