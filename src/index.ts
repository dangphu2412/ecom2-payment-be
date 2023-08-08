import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { registerAuthModule } from './modules/auth';
const fastifyEnv = require('@fastify/env')
import { OAuth2Namespace } from "@fastify/oauth2";

declare module 'fastify' {
    interface FastifyInstance  {
        googleOAuth2: OAuth2Namespace;
        config: {
            PORT: string;
            CLIENT_ID: string;
            CLIENT_SECRET: string;
        }
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
            }
        },
    });
    server.register(cors);
    server.register(helmet);
    server.register(registerAuthModule)

    try {
        await server.ready();
        await server.listen({ port: +server.config.PORT, host: '127.0.0.1' });
    } catch(err) {
        server.log.error(err);
        process.exit(1);
    }
}

bootstrap();
