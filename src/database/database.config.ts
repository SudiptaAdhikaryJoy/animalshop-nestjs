/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const createClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // Add error handler for the client
  client.on('error', (err) => {
    console.error('Unexpected database client error:', err);
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return client;
};

export const initDatabase = async () => {
  const client = createClient();

  try {
    await client.connect();
    console.log('Successfully connected to PostgreSQL');

    // Test the connection
    const testResult = await client.query('SELECT NOW()');
    console.log('Connection test result:', testResult.rows[0]);

    return drizzle(client);
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error);
    throw error;
  }
};
