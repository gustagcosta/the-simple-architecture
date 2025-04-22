import dotenv from 'dotenv';
dotenv.config();

import { createContainer, asClass, AwilixContainer, asValue } from 'awilix';
import mysql from 'mysql2/promise';
import { Redis } from 'ioredis';

import {
  IPaymentRepository,
  IUserRepository,
  PaymentRepository,
  UserRepository
} from '../repositories/index.js';

import { IPaymentGateway, IMessageService, PaymentGateway, MessageService } from '../external/index.js';

const redisConnection = await setupRedisConnection();
const mysqlConnection = await setupMysqlConnection();

type AppContainer = {
  mysqlConnection: mysql.Connection;
  redisConnection: Redis;
  userRepository: IUserRepository;
  paymentRepository: IPaymentRepository;
  paymentGateway: IPaymentGateway;
  messageService: IMessageService;
};

const container: AwilixContainer<AppContainer> = createContainer<AppContainer>();

container.register({
  mysqlConnection: asValue(mysqlConnection),
  redisConnection: asValue(redisConnection),
  userRepository: asClass(UserRepository).singleton(),
  paymentRepository: asClass(PaymentRepository).singleton(),
  paymentGateway: asClass(PaymentGateway).singleton(),
  messageService: asClass(MessageService).singleton()
});

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

console.log('container created');

export { container, AppContainer };
