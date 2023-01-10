type PumpType = 'GAS_95' | 'GAS_98' | 'DIESEL';

type PumpConfiguration = {
  price?: number | undefined;
  active?: boolean | undefined;
};

export interface IStationData {
  id?: string;
  name: string;
  city?: string;
  street?: string;
  latitude: number;
  longitude: number;
  pumps?: Record<PumpType, PumpConfiguration> | undefined;
}

export class Station {
  id?: string;
  name: string;
  city?: string;
  street?: string;
  latitude: number;
  longitude: number;
  pumps?: Record<PumpType, PumpConfiguration> | undefined;

  constructor(parameters: IStationData) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.city = parameters.city;
    this.street = parameters.street;
    this.latitude = parameters.latitude;
    this.longitude = parameters.longitude;
    this.pumps = parameters.pumps;
  }

  jsonify(): IStationData {
    return {
      id: this.id,
      name: this.name,
      city: this.city,
      street: this.street,
      pumps: {
        GAS_95: {
          price: this.pumps?.GAS_95?.price,
          active: this.pumps?.GAS_95?.active,
        },
        GAS_98: {
          price: this.pumps?.GAS_98?.price,
          active: this.pumps?.GAS_98?.active,
        },
        DIESEL: {
          price: this.pumps?.DIESEL?.price,
          active: this.pumps?.DIESEL?.active,
        },
      },
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
}
