import mysql from 'mysql2/promise';
import { db } from '../db.js';
import { Payment } from '../../entities/index.js';

export interface IPaymentRepository {
  createAndGetId(payment: Payment): Promise<number>;
}

export class PaymentRepository implements IPaymentRepository {
  public async createAndGetId(payment: Payment): Promise<number> {
    const [result] = await db.execute<mysql.ResultSetHeader>(
      `INSERT INTO payments (payer_id, payee_id, value, status, date) VALUES (?, ?, ?, ?, ?)`,
      [payment.payer_id, payment.payee_id, payment.value, payment.status, payment.date]
    );

    return result.insertId;
  }
}
