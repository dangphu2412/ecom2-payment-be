import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { authPlugin } from './modules/auth';
const fastifyEnv = require('@fastify/env')
import {databasePlugin} from "./modules/externals/database/database-client";
import {PrismaClient} from "@prisma/client";

declare module 'fastify' {
    interface FastifyInstance  {
        config: {
            PORT: string;
            CLIENT_ID: string;
            CLIENT_SECRET: string;
            ACCESS_TOKEN_SECRET: string;
        }
        databaseUnitOfWork: PrismaClient;
    }
}


const server = fastify({
    logger: true
});

async function bootstrap() {
    server.register(fastifyEnv, {
        dotenv: true,
        schema: {
            type: 'object',
            required: ['PORT', 'CLIENT_SECRET', 'CLIENT_ID'],
            properties: {
                PORT: {
                    type: 'string'
                },
                CLIENT_SECRET: {
                    type: 'string'
                },
                CLIENT_ID: {
                    type: 'string'
                },
                ACCESS_TOKEN_SECRET: {
                    type: 'string'
                }
            }
        },
    });
    server.register(async () => {}, {prefix: '/api'})
    server.register(cors);
    server.register(helmet);
    server.register(authPlugin)
    server.register(databasePlugin)

    try {
        await server.ready();
        await server.listen({ port: +server.config.PORT });
    } catch(err) {
        server.log.error(err);
        process.exit(1);
    }
}

bootstrap();
