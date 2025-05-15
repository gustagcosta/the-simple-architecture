import mysql from 'mysql2/promise';

import { User } from '../entities/index.js';
import { ApplicationError, ErrorTypes } from '../shared/index.js';
import { AppContainer } from '../config/container.js';

export interface IUserRepository {
  getById(userId: number): Promise<User>;
  createAndGetId(user: User): Promise<number>;
}

export class UserRepository implements IUserRepository {
  private mysqlConnection: mysql.Connection;

  constructor({ mysqlConnection }: AppContainer) {
    this.mysqlConnection = mysqlConnection;
  }

  public async getById(userId: number): Promise<User> {
    const [rows] = await this.mysqlConnection.execute<mysql.RowDataPacket[]>(
      'SELECT id, name, email, password FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) throw new ApplicationError('User not found', ErrorTypes.NotFoundError);

    const [row] = rows;

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password
    };
  }

  public async createAndGetId(user: User): Promise<number> {
    try {
      const [result] = await this.mysqlConnection.execute<mysql.ResultSetHeader>(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [user.name, user.email, user.password]
      );

      return result.insertId;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ApplicationError('Email already in use', ErrorTypes.ConflictError);
      }

      throw error;
    }
  }
}
