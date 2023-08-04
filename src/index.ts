import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { EnvAccessorUtils } from './utils/env-accessor';

const server = fastify();

server.register(cors);
server.register(helmet);

server.get('/ping', async (request, reply) => {
    return 'pong\n';
})

server.listen({ port: +EnvAccessorUtils.get('PORT') }, (err, address) => {
    if (err) {
        console.error(err);
        return process.exit(1);
    }

    console.log(`Server listening at ${address}`)
});
