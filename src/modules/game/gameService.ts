import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { gameRepository } from '@modules/game/gameRepository';

import { AvailableResponse, GameResultResponse } from './gameTypes';

export const gameService = {
  available: true,
  // Retrieves all games from the database
  start: (gameUuid: string, score: number): ServiceResponse<GameResultResponse | null> => {
    const game = gameRepository.start(gameUuid, score);
    if (!game) {
      return new ServiceResponse(ResponseStatus.Failed, 'Game already exists', null, StatusCodes.FORBIDDEN);
    }
    const { play, newScore } = gameRepository.play(gameUuid);
    return new ServiceResponse<GameResultResponse>(
      ResponseStatus.Success,
      'Ok I am in for the fun!',
      { play, newScore, win: newScore == 1 },
      StatusCodes.OK
    );
  },
  play: (gameUuid: string, score: number): ServiceResponse<GameResultResponse | null> => {
    const game = gameRepository.exists(gameUuid);
    if (!game) {
      return new ServiceResponse(ResponseStatus.Failed, 'Game does not exist', null, StatusCodes.NOT_FOUND);
    }
    const updateScore = gameRepository.updateScore(gameUuid, score);
    if (!updateScore) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Either game ended or you are cheating!!',
        null,
        StatusCodes.FORBIDDEN
      );
    }
    const { play, newScore } = gameRepository.play(gameUuid);
    return new ServiceResponse<GameResultResponse>(
      ResponseStatus.Success,
      'Ok I am in for the fun!',
      { play, newScore, win: newScore == 1 },
      StatusCodes.OK
    );
  },
  switchBusy: (): ServiceResponse<AvailableResponse> => {
    gameService.available = !gameService.available;
    return gameService.isBusy();
  },
  isBusy: (): ServiceResponse<AvailableResponse> => {
    const message = gameService.available ? "Let's play" : 'Sorry I am out of reach at the moment';
    return new ServiceResponse<AvailableResponse>(
      ResponseStatus.Success,
      message,
      { available: gameService.available },
      gameService.available ? StatusCodes.OK : StatusCodes.LOCKED
    );
  },
};
