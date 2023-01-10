import { Router } from 'express';
import { Stations } from '../repositories/stations';
import { IStationData, Station } from '../models';
import { PostgreClient, postgreClient } from '../clients';

interface IStationApiDependencies {
  postgreClient: PostgreClient
}

export const createStationsController = (dependencies: IStationApiDependencies = { postgreClient }): Router => {
  const router: Router = Router();

  router.get('', async function (_req, res) {
    const stationsRepository = new Stations(dependencies);
    const stations = (await stationsRepository.getAll()).map((station: Station) => station.jsonify());

    res.send(stations);
  });

  router.get('/:id', async function (req, res) {
    const stationsRepository = new Stations(dependencies);

    const id: string = req.params.id;
    const station: Station | undefined = await stationsRepository.getById(id);
    if (!station) {
      return res.send(404).send();
    }

    return res.send(station.jsonify());
  });

  router.post('', async function (req, res) {
    const stationsRepository = new Stations(dependencies);

    const stationData = req.body as IStationData;
    const newStation = await stationsRepository.save(new Station(stationData));

    return res.status(201).send(newStation.jsonify());
  });

  router.put('/:id', async function (req, res) {
    const stationsRepository = new Stations(dependencies);

    const stationData = req.body as IStationData;

    if (req.params.id !== stationData.id) {
      return res.status(422).send();
    }

    const currentStation = await stationsRepository.getById(req.params.id);
    if (!currentStation) {
      return res.status(404).send();
    }

    const station = await stationsRepository.save(new Station(stationData));

    return res.send(station.jsonify());
  });

  router.delete('/:id', async function (req, res) {
    const stationsRepository = new Stations(dependencies);

    const id = req.params.id;

    const station = await stationsRepository.getById(id);
    if (!station) {
      return res.status(404).send();
    }

    await stationsRepository.delete(station);

    return res.status(204).send();
  });

  return router;
};
