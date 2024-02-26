import { NextFunction, Request, Response } from 'express';

import { handleServiceResponse } from '@common/utils/httpHandlers';

import { gameService } from './gameService';

export const startGameMiddleware = (req: Request, res: Response) => {
  const serviceResponse = gameService.start(req.body.gameUuid, req.body.score);
  handleServiceResponse(serviceResponse, res);
};

export const playGameMiddleware = (req: Request, res: Response) => {
  const serviceResponse = gameService.play(req.body.gameUuid, req.body.score);
  handleServiceResponse(serviceResponse, res);
};

export const setPlayerBusyMiddleware = (_req: Request, res: Response) => {
  const serviceResponse = gameService.switchBusy();
  handleServiceResponse(serviceResponse, res);
};

export const checkPlayerIsNotBusyMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  const serviceResponse = gameService.isBusy();
  if (!serviceResponse.responseObject.available) handleServiceResponse(serviceResponse, res);
  else next();
};
