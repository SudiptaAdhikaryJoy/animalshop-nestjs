import { Resolver, Query } from '@nestjs/graphql';
import { Inject, OnModuleInit } from '@nestjs/common';
import { sql } from 'drizzle-orm';

@Resolver()
export class UserResolver implements OnModuleInit {
  private db: any;

  constructor(@Inject('DRIZZLE_DB') private readonly drizzleDb: Promise<any>) {}

  async onModuleInit() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.db = await this.drizzleDb;
  }

  @Query(() => String)
  async testDatabase() {
    try {
      console.log('Starting database query...');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const result = await this.db.execute(
        sql`SELECT CURRENT_TIMESTAMP as now`,
      );
      console.log('Raw query result:', JSON.stringify(result, null, 2));

      // Check if result exists and has the expected structure
      if (!result || !Array.isArray(result) || result.length === 0) {
        throw new Error('Invalid query result structure');
      }

      const timestamp = result[0]?.now;
      if (!timestamp) {
        throw new Error('Timestamp not found in query result');
      }

      console.log('Extracted timestamp:', timestamp);
      return `Database Connected: ${timestamp.toISOString()}`;
    } catch (error) {
      console.error('Database query error:', error);

      // Enhanced error reporting
      const errorMessage = error.message || 'Unknown error';
      const errorDetails = error.stack || '';
      console.error('Error details:', errorDetails);

      throw new Error(`Database query failed: ${errorMessage}`);
    }
  }
}
