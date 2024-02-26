import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { gameRepository } from '@modules/game/gameRepository';
import { gameService } from '@modules/game/gameService';
import { GameResultResponse } from '@modules/game/gameTypes';

jest.mock('@modules/game/gameRepository', () => ({
  gameRepository: {
    start: jest.fn(),
    exists: jest.fn(),
    updateScore: jest.fn(),
    play: jest.fn(),
  },
}));

describe('gameService', () => {
  describe('start', () => {
    it('should return ServiceResponse with Success status when starting a new game', () => {
      const gameUuid = 'game1';
      const score = 10;
      (gameRepository.start as jest.Mock).mockReturnValue(true);
      (gameRepository.play as jest.Mock).mockReturnValue({ play: 0, newScore: 1 });
      const result = gameService.start(gameUuid, score);
      expect(result).toEqual(
        new ServiceResponse<GameResultResponse>(
          ResponseStatus.Success,
          'Ok I am in for the fun!',
          { play: 0, newScore: 1, win: true },
          StatusCodes.OK
        )
      );
    });

    it('should return ServiceResponse with Failed status when game already exists', () => {
      const gameUuid = 'game1';
      const score = 10;
      (gameRepository.start as jest.Mock).mockReturnValue(false);
      const result = gameService.start(gameUuid, score);
      expect(result).toEqual(
        new ServiceResponse<GameResultResponse | null>(
          ResponseStatus.Failed,
          'Game already exists',
          null,
          StatusCodes.FORBIDDEN
        )
      );
    });
  });

  describe('play', () => {
    it('should return ServiceResponse with Success status when playing a game', () => {
      const gameUuid = 'game1';
      const score = 10;
      (gameRepository.exists as jest.Mock).mockReturnValue(true);
      (gameRepository.updateScore as jest.Mock).mockReturnValue(true);
      (gameRepository.play as jest.Mock).mockReturnValue({ play: 0, newScore: 1 });
      const result = gameService.play(gameUuid, score);
      expect(result).toEqual(
        new ServiceResponse<GameResultResponse>(
          ResponseStatus.Success,
          'Ok I am in for the fun!',
          { play: 0, newScore: 1, win: true },
          StatusCodes.OK
        )
      );
    });

    it('should return ServiceResponse with Failed status when game does not exist', () => {
      const gameUuid = 'game1';
      const score = 10;
      (gameRepository.exists as jest.Mock).mockReturnValue(false);
      const result = gameService.play(gameUuid, score);
      expect(result).toEqual(
        new ServiceResponse<GameResultResponse | null>(
          ResponseStatus.Failed,
          'Game does not exist',
          null,
          StatusCodes.NOT_FOUND
        )
      );
    });

    it('should return ServiceResponse with Failed status when updating score fails', () => {
      const gameUuid = 'game1';
      const score = 10;
      (gameRepository.exists as jest.Mock).mockReturnValue(true);
      (gameRepository.updateScore as jest.Mock).mockReturnValue(false);
      const result = gameService.play(gameUuid, score);
      expect(result).toEqual(
        new ServiceResponse<GameResultResponse | null>(
          ResponseStatus.Failed,
          'Either game ended or you are cheating!!',
          null,
          StatusCodes.FORBIDDEN
        )
      );
    });
  });

  describe('setBusy', () => {
    it('should toggle the availability status and return ServiceResponse with Success status', () => {
      const initialAvailability = gameService.available;
      const result = gameService.switchBusy();
      expect(gameService.available).toBe(!initialAvailability);
      expect(result.statusCode).toBe(StatusCodes.LOCKED);
      expect(result.responseObject).toEqual({ available: !initialAvailability });
    });
  });

  describe('isBusy', () => {
    it('should return ServiceResponse with Success status and correct message when available', () => {
      gameService.available = true;
      const result = gameService.isBusy();
      expect(result.statusCode).toBe(StatusCodes.OK);
      expect(result.responseObject).toEqual({ available: true });
      expect(result.message).toBe("Let's play");
    });

    it('should return ServiceResponse with Locked status and correct message when available', () => {
      gameService.available = false;
      const result = gameService.isBusy();
      expect(result.statusCode).toBe(StatusCodes.LOCKED);
      expect(result.responseObject).toEqual({ available: false });
      expect(result.message).toBe('Sorry I am out of reach at the moment');
    });
  });
});
