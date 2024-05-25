import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { fastifyEnv } from '@fastify/env';
import { PrismaClient } from '@prisma/client';
import { transactionPlugin } from './modules/transaction';
import { authPlugin } from './modules/auth';
import { userPlugin } from './modules/users';
import { databasePlugin } from './configs/database/database-client';
import { JWT } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: string;
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      ACCESS_TOKEN_SECRET: string;
    };
    uow: PrismaClient;
    jwt: JWT,
    authenticate: any
  }
}

const server = fastify({
  logger: true,
});

async function bootstrap() {
  server.register(fastifyEnv as any, {
    dotenv: true,
    schema: {
      type: 'object',
      required: ['PORT', 'CLIENT_SECRET', 'CLIENT_ID'],
      properties: {
        PORT: {
          type: 'string',
        },
        CLIENT_SECRET: {
          type: 'string',
        },
        CLIENT_ID: {
          type: 'string',
        },
        ACCESS_TOKEN_SECRET: {
          type: 'string',
        },
      },
    },
  });
  server.register(cors);
  server.register(helmet);
  server.register(authPlugin);
  server.register(userPlugin);
  server.register(transactionPlugin);
  server.register(databasePlugin);

  try {
    await server.ready();
    await server.listen({ port: parseInt(server.config.PORT) });
  } catch (err) {
    server.log.error(err);
    return process.exit(1);
  }
}

bootstrap();
