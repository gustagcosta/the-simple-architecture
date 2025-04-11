import dotenv from 'dotenv';
dotenv.config();

import Fastify from 'fastify';
import { ZodError } from 'zod';

import { CreateUserController } from './controllers/index.js';
import { ConflictError, ExpectedError, NotAllowedError, NotFoundError } from './shared/index.js';

const fastify = Fastify();

fastify.get('/', async function handler(request, reply) {
  return { hello: 'world' };
});

fastify.post('/users', async (request, reply) => {
  try {
    await CreateUserController.execute(request.body);
    return reply.code(201).send({ message: 'User created' });
  } catch (error) {
    handleError(error, reply);
  }
});

const handleError = (error: any, reply: Fastify.FastifyReply) => {
  if (error instanceof ZodError) {
    return reply.code(400).send({ error: error.errors });
  }

  if (error instanceof ExpectedError) {
    return reply.status(400).send({ success: false, message: error.message });
  }

  if (error instanceof ConflictError) {
    return reply.status(409).send({ success: false, message: error.message });
  }

  if (error instanceof NotAllowedError) {
    return reply.status(401).send({ success: false, message: error.message });
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({ success: false, message: error.message });
  }

  console.error({ error });

  return reply.status(500).send({ success: false, message: 'internal server error' });
};

try {
  await fastify.listen({ port: 3000 });
} catch (error) {
  console.error({ error });
  process.exit(1);
}
