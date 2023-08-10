import fastifyPlugin from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();

export const authPlugin = fastifyPlugin(async (fastify) => {
  fastify.post('/login/google', async (request, reply) => {
    const loginTicket = await client.verifyIdToken({
      idToken: (request.body as { idToken: string }).idToken,
      audience: fastify.config.CLIENT_ID,
    });

    const payload = loginTicket.getPayload();

    if (!payload) {
      return reply.status(500).send({
        message: 'Missing payload',
      });
    }

    const { email = '', name = '' } = payload;

    const user = await fastify.databaseUnitOfWork.user.findFirst({
      cursor: {
        email,
      },
    });

    const id = user
      ? user.id
      : (
          await fastify.databaseUnitOfWork.user.create({
            data: {
              email,
              fullName: name,
            },
          })
        ).id;

    return reply.status(200).send({
      accessToken: jwt.sign({ id }, fastify.config.ACCESS_TOKEN_SECRET),
    });
  });
});
