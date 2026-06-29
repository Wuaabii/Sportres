import pg from 'pg';
import { createDatabasePoolConfig } from './database-config.js';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn('[SportRes DB] DATABASE_URL is not set. Database API routes will fail until it is configured.');
}

export const pool = new Pool(createDatabasePoolConfig());

export const query = <T = any>(text: string, params?: any[]) => pool.query<T>(text, params);
