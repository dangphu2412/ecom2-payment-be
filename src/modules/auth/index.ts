import fastifyPlugin from 'fastify-plugin';

export const authPlugin = fastifyPlugin(async (fastify) => {
  fastify.register(require("@fastify/jwt"), {
    secret: "supersecret"
  });
  fastify.decorate("authenticate", async (request: any, reply: any) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  fastify.post('/login',
    async (request, reply) => {
      const { username } = request.body as { username: string };

      const user = await fastify.uow.user.findFirstOrThrow({
        where: {
          username
        }
      });

      const token = fastify.jwt.sign({ userId: user.id });

      return reply.send({ token })
    });
});
