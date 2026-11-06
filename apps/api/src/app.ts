import { randomUUID } from 'node:crypto';
import Fastify, { type FastifyBaseLogger } from 'fastify';
import swagger from '@fastify/swagger';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { Database } from './database/client.js';
import { createLogger } from './logger.js';
import { healthRoutes } from './modules/platform/health.js';

interface AppOptions {
  logger?: FastifyBaseLogger;
  database?: Pick<Database, 'ping' | 'close'>;
}

export async function buildApp(options: AppOptions = {}) {
  const app = Fastify({
    loggerInstance: options.logger ?? createLogger('silent'),
    requestIdHeader: false,
    genReqId: () => randomUUID(),
    bodyLimit: 64 * 1024,
    ajv: { customOptions: { removeAdditional: false, coerceTypes: false } },
  }).withTypeProvider<TypeBoxTypeProvider>();

  app.setErrorHandler((error, request, reply) => {
    const validation = error instanceof Error && 'validation' in error;
    const status = validation
      ? 400
      : error instanceof Error && 'statusCode' in error && typeof error.statusCode === 'number'
        ? error.statusCode
        : 500;
    const messages: Record<number, [string, string]> = {
      400: ['INVALID_REQUEST', 'Requisição inválida.'],
      413: ['PAYLOAD_TOO_LARGE', 'O conteúdo excede o limite permitido.'],
      415: ['UNSUPPORTED_MEDIA_TYPE', 'Formato de conteúdo não suportado.'],
    };
    const [code, message] = messages[status] ?? [
      'INTERNAL_ERROR',
      'Não foi possível concluir a operação.',
    ];
    if (status >= 500) request.log.error({ err: error }, 'Falha ao processar requisição');
    return reply.code(status).send({ error: { code, message, requestId: request.id } });
  });
  app.setNotFoundHandler((request, reply) =>
    reply.code(404).send({
      error: {
        code: 'NOT_FOUND',
        message: 'Recurso não encontrado.',
        requestId: request.id,
      },
    }),
  );

  await app.register(swagger, {
    openapi: {
      openapi: '3.1.0',
      info: { title: 'Kafofo API', version: '0.0.0' },
      servers: [{ url: '/' }],
      tags: [{ name: 'platform', description: 'Serviços básicos da plataforma' }],
    },
  });
  await app.register(healthRoutes(options.database?.ping ?? (async () => false)), {
    prefix: '/api',
  });
  app.get('/api/openapi.json', { schema: { hide: true } }, async () => app.swagger());
  app.addHook('onClose', async () => {
    await options.database?.close();
  });
  return app;
}
