import { buildHttpServer } from './http-server';

async function main(): Promise<void> {
  const server = buildHttpServer();
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? '0.0.0.0';

  await server.listen({ port, host });
  console.log(`DGLEA backend HTTP service listening on http://${host}:${port}`);
}

void main();
