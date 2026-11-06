import Fastify from 'fastify';
import type { Lab } from './lab.js';
import { LabError } from './policies.js';

export function buildServer(lab: Lab, origin: string) {
  const app = Fastify({ logger: false, trustProxy: false, bodyLimit: 8192 });
  app.addHook('onRequest', async (req, reply) => {
    reply.header('Cache-Control', 'no-store');
    reply.header('Referrer-Policy', 'no-referrer');
    if (
      req.method !== 'GET' &&
      (req.headers.origin !== origin || req.headers['sec-fetch-site'] === 'cross-site')
    )
      throw new LabError(403, 'UNTRUSTED_ORIGIN');
  });
  app.setErrorHandler((error, _req, reply) => {
    const status = error instanceof LabError ? error.status : 400;
    return reply
      .code(status)
      .send({ error: error instanceof LabError ? error.code : 'REQUEST_REJECTED' });
  });
  app.get('/lab/health', async () => ({ ok: true }));
  app.post<{ Body: { username: string; password: string } }>('/lab/login', async (req, reply) => {
    const response = await lab.login(req.body, headers(req.headers), req.ip);
    reply.header('set-cookie', response.headers.getSetCookie());
    return reply
      .code(response.ok ? 200 : 401)
      .send(response.ok ? { ok: true } : { error: 'INVALID_CREDENTIALS' });
  });
  app.get('/lab/me', async (req) => {
    const session = await lab.getSession(headers(req.headers));
    if (!session) throw new LabError(401, 'UNAUTHENTICATED');
    return { id: session.user.id, username: session.user.username, name: session.user.name };
  });
  app.post('/lab/logout', async (req, reply) => {
    const response = await lab.auth.api.signOut({
      headers: headers(req.headers),
      asResponse: true,
    });
    reply.header('set-cookie', response.headers.getSetCookie());
    return reply.code(response.status).send({ ok: response.ok });
  });
  app.post<{ Body: { currentPassword: string; newPassword: string } }>(
    '/lab/change-password',
    async (req, reply) => {
      const response = await lab.changePassword(
        headers(req.headers),
        req.body.currentPassword,
        req.body.newPassword,
      );
      reply.header('set-cookie', response.headers.getSetCookie());
      return reply.code(response.ok ? 200 : 400).send({ ok: response.ok });
    },
  );
  app.post<{ Body: { userId: string } }>('/lab/recovery', async (req) => {
    const recovery = await lab.issueRecovery(
      { kind: 'admin', headers: headers(req.headers) },
      req.body.userId,
    );
    return { link: recovery.link };
  });
  app.post<{ Body: { token: string; newPassword: string } }>('/lab/reset', async (req) => {
    await lab.rate('reset-origin:' + req.ip, 30, 60000);
    await lab.reset(req.body.token, req.body.newPassword);
    return { ok: true };
  });
  app.post<{ Body: { token: string; username: string; password: string } }>(
    '/lab/bootstrap',
    async (req) => {
      await lab.rate('bootstrap-origin:' + req.ip, 10, 60000);
      return lab.bootstrap(req.body.token, req.body);
    },
  );
  return app;
}
function headers(input: Record<string, string | string[] | undefined>) {
  const result = new Headers();
  for (const [key, value] of Object.entries(input))
    if (value !== undefined) result.set(key, Array.isArray(value) ? value.join(', ') : value);
  return result;
}
