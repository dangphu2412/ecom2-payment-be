import { PrismaClient } from '@prisma/client'
import fastifyPlugin from 'fastify-plugin'


export const databasePlugin = fastifyPlugin(async (fastify) => {
  const prisma = new PrismaClient();

  await prisma.$connect();

  fastify.log.info('Connected to the database');
  fastify.decorate('databaseUnitOfWork', prisma);
})
