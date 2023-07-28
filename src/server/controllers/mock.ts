/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';

import { mock } from '../mocks/mock';

const getMockData = (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.send(mock);
  } catch (err) {
    next(err);
  }
};

const plusMockData = (req: Request, res: Response, next: NextFunction) => {
  try {
    mock.push({ ...mock[0], id: mock.length });

    return res.send(mock);
  } catch (err) {
    next(err);
  }
};

export { getMockData, plusMockData };