import { NextFunction, Request, Response } from 'express';
import { PostgreClient, postgreClient } from '../clients';
import { Users } from '../repositories/users';

export const createAuthenticationMiddleware = (dependencies: { postgreClient: PostgreClient } = { postgreClient }) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const usersRepository = new Users(dependencies);

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(403).send();
    }

    const user = await usersRepository.getByApiKey(token);

    if (!user) {
      return res.status(403).send();
    }

    return next();
  };
};
