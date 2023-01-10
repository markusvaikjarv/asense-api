import pg, { QueryResult } from 'pg';

export class PostgreClient {
  private connection?: pg.Pool;

  private getConnection(): pg.Pool {
    if (!this.connection) {
      const config = {
        database: process.env.PSQL_DB,
        host: process.env.PSQL_HOST,
        port: parseInt(process.env.PSQL_PORT as string),
        user: process.env.PSQL_USER,
        password: process.env.PSQL_PASS,
        max: 10,
        idleTimeoutMillis: 30000,
      };

      this.connection = new pg.Pool(config);
    }

    return this.connection;
  }

  async query(query: string, params?: (number | string | undefined | null | boolean)[]): Promise<QueryResult<any>> {
    return this.getConnection().query(query, params);
  }
}

export const postgreClient = new PostgreClient();
