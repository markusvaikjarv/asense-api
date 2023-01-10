import { postgreClient } from '../clients';
import { v4 as uuidv4 } from 'uuid';
import { hashSHA256 } from '../utils';

interface IUserDbRow {
  id: string;
  api_key_sha256: string;
}

export interface IUserData {
  id?: string;
  apiKeyHash: string;
}

export class User {
  id?: string;
  apiKeyHash: string;

  constructor(parameters: IUserData) {
    this.id = parameters.id;
    this.apiKeyHash = parameters.apiKeyHash;
  }

  static async getByApiKey(apiKey: string): Promise<User | undefined> {
    const dbRes = await postgreClient.query('SELECT * FROM users WHERE api_key_sha256 = $1', [hashSHA256(apiKey)]);

    const userData = dbRes.rows[0] as IUserDbRow | undefined;

    if (!userData) {
      return;
    }

    return this.fromDbRow(userData);
  }

  private static fromDbRow(row: IUserDbRow): User {
    return new User({
      id: row.id,
      apiKeyHash: row.api_key_sha256,
    });
  }

  generateApiKey(): string {
    const apiKey = uuidv4();
    this.apiKeyHash = hashSHA256(apiKey);
    return apiKey;
  }

  async delete(): Promise<void> {
    await postgreClient.query('DELETE FROM users WHERE id = $1', [this.id]);

    return;
  }

  async save(): Promise<User> {
    if (this.id) {
      await postgreClient.query(
        `
        UPDATE users
        SET
          api_key_sha256 = $2
        WHERE
          id = $1;`,
        [this.id, this.apiKeyHash]
      );
    } else {
      if (!this.apiKeyHash) {
        throw new Error('Unable to save - user has no API key assigned');
      }

      const dbRes = await postgreClient.query(
        `
        INSERT INTO
          users(api_key_sha256)
        VALUES
          ($1)
        RETURNING *`,
        [this.apiKeyHash]
      );
      const userData = dbRes.rows[0] as IUserDbRow;
      this.id = userData.id;
    }

    return this;
  }
}
