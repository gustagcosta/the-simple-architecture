import dotenv from 'dotenv';
dotenv.config();

import Fastify from 'fastify';
import { ZodError } from 'zod';

import { ApplicationError } from './shared/index.js';
import { setupContainer } from './config/container.js';

const fastify = Fastify();

const executeRule = (controllerName: string, responseCode: number) => {
  return async (request: any, reply: any) => {
    try {
      const container = await setupContainer();

      const controller = container.resolve(`${controllerName}Controller`) as any;

      const response = await controller.execute(request.body);

      return reply.code(responseCode).send(response);
    } catch (error) {
      handleError(error, reply);
    }
  };
};

fastify.get('/', async function handler(request, reply) {
  return { hello: 'world' };
});

fastify.post('/users', executeRule('createUser', 201));

fastify.post('/payments', executeRule('createPayment', 201));

const handleError = (error: any, reply: Fastify.FastifyReply) => {
  if (error instanceof ZodError) {
    return reply.code(400).send({ error: error.errors });
  }

  if (error instanceof ApplicationError) {
    const response: any = { success: false, message: error.message };

    if (error.extras) {
      response.extras = error.extras;
    }

    return reply.status(error.code).send(response);
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
