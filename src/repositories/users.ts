import { User } from '../models';
import { PostgreClient, postgreClient } from '../clients';
import { hashSHA256 } from '../utils';

interface IUserDbRow {
  id: string;
  api_key_sha256: string;
}

interface IUsersDependencies {
  postgreClient: PostgreClient;
}

export interface IUserData {
  id?: string;
  apiKeyHash: string;
}

export class Users {
  dependencies: IUsersDependencies;

  constructor(dependencies: IUsersDependencies = { postgreClient }) {
    this.dependencies = dependencies;
  }

  async getByApiKey(apiKey: string): Promise<User | undefined> {
    const dbRes = await this.dependencies.postgreClient.query('SELECT * FROM users WHERE api_key_sha256 = $1', [
      hashSHA256(apiKey),
    ]);

    const userData = dbRes.rows[0] as IUserDbRow | undefined;

    if (!userData) {
      return;
    }

    return this.fromDbRow(userData);
  }

  private fromDbRow(row: IUserDbRow): User {
    return new User({
      id: row.id,
      apiKeyHash: row.api_key_sha256,
    });
  }

  async delete(user: User): Promise<void> {
    if (!user.id) {
      throw new Error('User is missing ID');
    }

    await this.dependencies.postgreClient.query('DELETE FROM users WHERE id = $1', [user.id]);

    return;
  }

  async save(user: User): Promise<User> {
    if (user.id) {
      await postgreClient.query(
        `
        UPDATE users
        SET
          api_key_sha256 = $2
        WHERE
          id = $1;`,
        [user.id, user.apiKeyHash]
      );
    } else {
      if (!user.apiKeyHash) {
        throw new Error('Unable to save - user has no API key assigned');
      }

      const dbRes = await this.dependencies.postgreClient.query(
        `
        INSERT INTO
          users(api_key_sha256)
        VALUES
          ($1)
        RETURNING *`,
        [user.apiKeyHash]
      );
      const userData = dbRes.rows[0] as IUserDbRow;
      user.id = userData.id;
    }

    return user;
  }
}
