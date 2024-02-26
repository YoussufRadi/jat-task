import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { ServiceResponse } from '@common/models/serviceResponse';
import { games } from '@modules/game/gameRepository';
import { gameService } from '@modules/game/gameService';
import { GameResultResponse } from '@modules/game/gameTypes';
import { app } from '@src/server';

describe('Game API Endpoints', () => {
  describe('POST /games/start', () => {
    beforeEach(() => {
      gameService.available = true;
    });
    it('should return 400 for startGameMiddleware with non valid uuid gameUuid', async () => {
      const response = await request(app).post('/games/start').send({ gameUuid: 'test', score: 10 });
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('should return 200 for startGameMiddleware with correct uuid gameUuid', async () => {
      const response = await request(app)
        .post('/games/start')
        .send({ gameUuid: 'b5e92176-7f9e-4b3a-83fa-68c4e2d3566c', score: 56 });
      const responseBody: ServiceResponse<GameResultResponse> = response.body;
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.responseObject).toEqual({ newScore: 19, play: 1, win: false });
    });

    it('should return non available when gameService.available is false', async () => {
      gameService.available = false;
      const response = await request(app)
        .post('/games/start')
        .send({ gameUuid: 'b5e92176-7f9e-4b3a-83fa-68c4e2d3566c', score: 56 });
      expect(response.statusCode).toEqual(StatusCodes.LOCKED);
    });
  });

  describe('POST /games/play', () => {
    beforeEach(() => {
      gameService.available = true;
    });
    it('should return 400 for play with score less than 1', async () => {
      const response = await request(app)
        .post('/games/play')
        .send({ gameUuid: 'b5e92176-7f9e-4b3a-83fa-68c4e2d3566a', score: 1 });
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('should return 400 for play with non valid uuid gameUuid', async () => {
      const response = await request(app).post('/games/play').send({ gameUuid: 'xxxxx', score: 10 });
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('should return 404 for play with a valid uuid gameUuid but did not start yet', async () => {
      const response = await request(app)
        .post('/games/play')
        .send({ gameUuid: 'b5e92176-7f9e-4b3a-83fa-68c4e2d3566a', score: 10 });
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });

    it('should return cheating for play with non valid score', async () => {
      games['b5e92176-7f9e-4b3a-83fa-68c4e2d3566a'] = 19;
      const response = await request(app)
        .post('/games/play')
        .send({ gameUuid: 'b5e92176-7f9e-4b3a-83fa-68c4e2d3566a', score: 2 });
      expect(response.statusCode).toEqual(StatusCodes.FORBIDDEN);
    });

    it('should return cheating for play with non valid score', async () => {
      games['b5e92176-7f9e-4b3a-83fa-68c4e2d3566a'] = 19;
      const response = await request(app)
        .post('/games/play')
        .send({ gameUuid: 'b5e92176-7f9e-4b3a-83fa-68c4e2d3566a', score: 6 });
      const responseBody: ServiceResponse<GameResultResponse> = response.body;
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.responseObject).toEqual({ newScore: 2, play: 0, win: false });
    });

    it('should return non available when gameService.available is false', async () => {
      gameService.available = false;
      games['b5e92176-7f9e-4b3a-83fa-68c4e2d3566a'] = 19;
      const response = await request(app)
        .post('/games/play')
        .send({ gameUuid: 'b5e92176-7f9e-4b3a-83fa-68c4e2d3566a', score: 6 });
      expect(response.statusCode).toEqual(StatusCodes.LOCKED);
    });
  });

  describe('PATCH /games/busy', () => {
    beforeEach(() => {
      gameService.available = true;
    });
    it('setPlayerBusyMiddleware should switch player to non available when gameService.available is true', async () => {
      const response = await request(app).patch('/games/busy');
      expect(response.statusCode).toEqual(StatusCodes.LOCKED);
      expect(gameService.available).toEqual(false);
    });

    it('setPlayerBusyMiddleware should switch player to non available when gameService.available is false', async () => {
      gameService.available = false;
      const response = await request(app).patch('/games/busy');
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(gameService.available).toEqual(true);
    });
  });
});
