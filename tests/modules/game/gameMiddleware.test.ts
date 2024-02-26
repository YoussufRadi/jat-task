import { Request, Response } from 'express';

import { handleServiceResponse } from '@common/utils/httpHandlers';
import {
  checkPlayerIsNotBusyMiddleware,
  playGameMiddleware,
  setPlayerBusyMiddleware,
  startGameMiddleware,
} from '@modules/game/gameMiddleware';
import { gameService } from '@modules/game/gameService';

jest.mock('@modules/game/gameService');
jest.mock('@common/utils/httpHandlers', () => ({
  handleServiceResponse: jest.fn(),
}));

describe('gameMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  });

  describe('startGameMiddleware', () => {
    it('should call gameService.start and handleServiceResponse', () => {
      const mockServiceResponse = { status: 'Success', responseObject: {}, message: 'OK' };
      (gameService.start as jest.Mock).mockReturnValue(mockServiceResponse);

      startGameMiddleware(req as Request, res as Response);

      expect(gameService.start).toHaveBeenCalledWith(req.body.gameUuid, req.body.score);
      expect(handleServiceResponse).toHaveBeenCalledWith(mockServiceResponse, res);
    });
  });

  describe('playGameMiddleware', () => {
    it('should call gameService.play and handleServiceResponse', () => {
      const mockServiceResponse = { status: 'Success', responseObject: {}, message: 'OK' };
      (gameService.play as jest.Mock).mockReturnValue(mockServiceResponse);

      playGameMiddleware(req as Request, res as Response);

      expect(gameService.play).toHaveBeenCalledWith(req.body.gameUuid, req.body.score);
      expect(handleServiceResponse).toHaveBeenCalledWith(mockServiceResponse, res);
    });
  });

  describe('setPlayerBusyMiddleware', () => {
    it('should call gameService.switchBusy and handleServiceResponse', () => {
      const mockServiceResponse = { status: 'Success', responseObject: {}, message: 'OK' };
      (gameService.switchBusy as jest.Mock).mockReturnValue(mockServiceResponse);

      setPlayerBusyMiddleware(req as Request, res as Response);

      expect(gameService.switchBusy).toHaveBeenCalled();
      expect(handleServiceResponse).toHaveBeenCalledWith(mockServiceResponse, res);
    });
  });

  describe('checkPlayerIsNotBusyMiddleware', () => {
    it('should call gameService.isBusy, handleServiceResponse, and next if player is not busy', () => {
      const mockServiceResponse = { status: 'Success', responseObject: { available: true }, message: 'OK' };
      (gameService.isBusy as jest.Mock).mockReturnValue(mockServiceResponse);
      const next = jest.fn();

      checkPlayerIsNotBusyMiddleware(req as Request, res as Response, next);

      expect(gameService.isBusy).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(handleServiceResponse).not.toHaveBeenCalled();
    });

    it('should call gameService.isBusy and handleServiceResponse if player is busy', () => {
      const mockServiceResponse = { status: 'Success', responseObject: { available: false }, message: 'OK' };
      (gameService.isBusy as jest.Mock).mockReturnValue(mockServiceResponse);
      const next = jest.fn();

      checkPlayerIsNotBusyMiddleware(req as Request, res as Response, next);

      expect(gameService.isBusy).toHaveBeenCalled();
      expect(handleServiceResponse).toHaveBeenCalledWith(mockServiceResponse, res);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
