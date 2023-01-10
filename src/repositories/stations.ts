import { Station } from '../models';
import { PostgreClient, postgreClient } from '../clients';

interface IStationDbRow {
  id: string;
  name: string;
  city?: string;
  street?: string;
  latitude: number;
  longitude: number;
  gas_95_price?: number;
  gas_95_active: boolean;
  gas_98_price?: number;
  gas_98_active: boolean;
  diesel_price?: number;
  diesel_active?: boolean;
  created_at: string;
  modified_at: string;
}

type PumpType = 'GAS_95' | 'GAS_98' | 'DIESEL';

type PumpConfiguration = {
  price?: number | undefined;
  active?: boolean | undefined;
};

export interface IStationData {
  id?: string;
  name?: string;
  city?: string;
  street?: string;
  latitude?: number;
  longitude?: number;
  pumps?: Record<PumpType, PumpConfiguration> | undefined;
}

interface IStationsDependencies {
  postgreClient: PostgreClient;
}

export class Stations {
  dependencies: IStationsDependencies;

  constructor(dependencies: IStationsDependencies = { postgreClient }) {
    this.dependencies = dependencies;
  }

  async getAll(): Promise<Station[]> {
    const stations: Station[] = [];

    const dbRes = await this.dependencies.postgreClient.query(
      'SELECT *, ST_X(ST_AsText(location)) as longitude, ST_Y(ST_AsText(location)) as latitude FROM stations ORDER BY created_at DESC'
    );
    for (const row of dbRes.rows as IStationDbRow[]) {
      const station = this.fromDbRow(row);
      stations.push(station);
    }

    return stations;
  }

  async getById(id: string): Promise<Station | undefined> {
    const dbRes = await this.dependencies.postgreClient.query(
      'SELECT *, ST_X(ST_AsText(location)) as longitude, ST_Y(ST_AsText(location)) as latitude FROM stations WHERE id = $1',
      [id]
    );
    const stationDbRow = dbRes.rows[0] as IStationDbRow | undefined;

    if (!stationDbRow) {
      return;
    }

    return this.fromDbRow(stationDbRow);
  }

  private fromDbRow(row: IStationDbRow): Station {
    return new Station({
      id: row.id,
      name: row.name,
      city: row.city,
      street: row.street,
      latitude: row.latitude,
      longitude: row.longitude,
      pumps: {
        GAS_95: {
          price: row.gas_95_price,
          active: row.gas_95_active,
        },
        GAS_98: {
          price: row.gas_98_price,
          active: row.gas_98_active,
        },
        DIESEL: {
          price: row.diesel_price,
          active: row.diesel_active,
        },
      },
    });
  }

  async delete(station: Station): Promise<void> {
    if (!station.id) {
      throw Error('Missing station id');
    }
    await this.dependencies.postgreClient.query('DELETE FROM stations WHERE id = $1', [station.id]);

    return;
  }

  async save(station: Station): Promise<Station> {
    if (station.id) {
      await this.dependencies.postgreClient.query(
        `
        UPDATE stations
        SET
          name = $2,
          city = $3,
          street = $4,
          location = ST_MakePoint($5, $6),
          gas_95_price = $7,
          gas_95_active = $8,
          gas_98_price = $9,
          gas_98_active = $10,
          diesel_price = $11,
          diesel_active = $12
        WHERE
          id = $1;`,
        [
          station.id,
          station.name,
          station.city,
          station.street,
          station.longitude,
          station.latitude,
          station.pumps?.GAS_95?.price,
          station.pumps?.GAS_95?.active,
          station.pumps?.GAS_98?.price,
          station.pumps?.GAS_98?.active,
          station.pumps?.DIESEL?.price,
          station.pumps?.DIESEL?.active,
        ]
      );
    } else {
      const dbRes = await this.dependencies.postgreClient.query(
        `
        INSERT INTO
          stations(name, city, street, location, gas_95_price, gas_95_active, gas_98_price, gas_98_active, diesel_price, diesel_active)
        VALUES
          ($1, $2, $3, ST_MakePoint($4, $5), $6, $7, $8, $9, $10, $11)
        RETURNING *`,
        [
          station.name,
          station.city,
          station.street,
          station.longitude,
          station.latitude,
          station.pumps?.GAS_95?.price,
          station.pumps?.GAS_95?.active,
          station.pumps?.GAS_98?.price,
          station.pumps?.GAS_98?.active,
          station.pumps?.DIESEL?.price,
          station.pumps?.DIESEL?.active,
        ]
      );
      const stationData = dbRes.rows[0] as IStationDbRow;
      station.id = stationData.id;
    }

    return station;
  }
}
