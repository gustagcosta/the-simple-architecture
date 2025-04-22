import mysql from 'mysql2/promise';

import { Payment } from '../entities/index.js';
import { AppContainer } from '../config/container.js';

export interface IPaymentRepository {
  createAndGetId(payment: Payment): Promise<number>;
}

export class PaymentRepository implements IPaymentRepository {
  private mysqlConnection: mysql.Connection;

  constructor({ mysqlConnection }: AppContainer) {
    this.mysqlConnection = mysqlConnection;
  }

  public async createAndGetId(payment: Payment): Promise<number> {
    const [result] = await this.mysqlConnection.execute<mysql.ResultSetHeader>(
      `INSERT INTO payments (payer_id, payee_id, value, status, date) VALUES (?, ?, ?, ?, ?)`,
      [payment.payer_id, payment.payee_id, payment.value, payment.status, payment.date]
    );

    return result.insertId;
  }
}
