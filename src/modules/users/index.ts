import fastifyPlugin from 'fastify-plugin';

export const userPlugin = fastifyPlugin(async (fastify) => {
  fastify.get('/users', { onRequest: [fastify.authenticate] }, async (context, reply) => {
    const user = context.user as { userId: string };

    const data = await fastify.uow.user.findMany({
      include: {
        senders: true
      }
    })

    return reply.send(data)
  })
});
