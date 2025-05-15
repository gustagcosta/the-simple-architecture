import dotenv from 'dotenv';
dotenv.config();

import { randomUUID } from 'crypto';
import { createContainer, asClass, AwilixContainer, asValue } from 'awilix';
import mysql from 'mysql2/promise';
import { Redis } from 'ioredis';

import { IPaymentRepository, IUserRepository, PaymentRepository, UserRepository } from '../repositories/index.js';
import { IMessageService, IPaymentGateway, MessageService, PaymentGateway } from '../external/index.js';
import { CreatePaymentController, CreateUserController } from '../controllers/index.js';
import { CreatePaymentUseCase, CreateUserUseCase } from '../usecases/index.js';

export type AppContainer = {
  uuid: string;

  mysqlConnection: mysql.Connection;
  redisConnection: Redis;

  userRepository: IUserRepository;
  paymentRepository: IPaymentRepository;

  paymentGateway: IPaymentGateway;

  messageService: IMessageService;

  createPaymentController: CreatePaymentController;
  createUserController: CreateUserController;

  createPaymentUseCase: CreatePaymentUseCase;
  createUserUseCase: CreateUserUseCase;
};

export async function setupContainer() {
  const redisConnection = await setupRedisConnection();
  const mysqlConnection = await setupMysqlConnection();

  const container: AwilixContainer<AppContainer> = createContainer<AppContainer>();

  container.register({
    uuid: asValue(randomUUID()),
    mysqlConnection: asValue(mysqlConnection),
    redisConnection: asValue(redisConnection),
    userRepository: asClass(UserRepository).scoped(),
    paymentRepository: asClass(PaymentRepository).scoped(),
    paymentGateway: asClass(PaymentGateway).scoped(),
    messageService: asClass(MessageService).scoped(),
    createPaymentController: asClass(CreatePaymentController).scoped(),
    createUserController: asClass(CreateUserController).scoped(),
    createPaymentUseCase: asClass(CreatePaymentUseCase).scoped(),
    createUserUseCase: asClass(CreateUserUseCase).scoped()
  });

  console.log('container created');

  return container;
}

async function setupMysqlConnection() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  await db.ping();

  console.log('db connected');

  return db;
}

async function setupRedisConnection() {
  const redis = new Redis();

  const result = await redis.ping();

  if (result === 'PONG') {
    console.log('redis connected');
  }

  return redis;
}
