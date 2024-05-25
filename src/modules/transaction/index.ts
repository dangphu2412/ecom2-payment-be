import fastifyPlugin from 'fastify-plugin';

type CreateTransactionInput = {
  toUserId: number;
  amount: number;
}

export const transactionPlugin = fastifyPlugin(async (fastify) => {
  fastify.addSchema({
    $id: 'createTransaction',
    type: 'object',
    required: ['toUserId', 'amount'],
    properties: {
      toUserId: { type: 'number' },
      amount: { type: 'number' }
    }
  });

  fastify.get('/transactions', { onRequest: [fastify.authenticate] }, async (context, reply) => {
    const user = context.user as { userId: string };

    const data = await fastify.uow.user.findFirst({
      include: {
        senders: true,
        receivers: true
      }
    })

    return reply.send(data)
  })

  fastify.post('/transactions', {
    onRequest: [fastify.authenticate],
    schema: {
      body: {
        $ref: 'createTransaction'
      }
    }
  }, async (request, reply) => {
    const user = request.user as { userId: string };
    const body = request.body as CreateTransactionInput;

    const currentUser = await fastify.uow.user.findFirstOrThrow({
      where: {
        id: +user.userId
      }
    });
    const toUser = await fastify.uow.user.findFirstOrThrow({
      where: {
        id: body.toUserId
      }
    })

    if (currentUser.balance === 0) {
      return reply.send({ message: '0 balance' })
    }

    if (currentUser.balance < body.amount) {
      return reply.send({ message: "Not enough money bae" });
    }

    fastify.uow.$transaction([
      fastify.uow.transaction.create({
        data: {
          fromUserId: +currentUser.id,
          toUserId: toUser.id,
          amount: body.amount
        }
      }),
      fastify.uow.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          balance: currentUser.balance - body.amount
        }
      }),
      fastify.uow.user.update({
        where: {
          id: body.toUserId
        },
        data: {
          balance: currentUser.balance + body.amount
        }
      })
    ])

    return reply.send({ message: 'heelo' })
  });
});
