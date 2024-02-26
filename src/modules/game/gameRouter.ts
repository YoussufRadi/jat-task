import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@api-docs/openAPIResponseBuilders';
import { validateRequest } from '@common/utils/httpHandlers';

import {
  checkPlayerIsNotBusyMiddleware,
  playGameMiddleware,
  setPlayerBusyMiddleware,
  startGameMiddleware,
} from './gameMiddleware';
import { GameSchema, PlayerAvailableSchema, PlayGameSchema, StartGameSchema } from './gameModel';

export const gameRegistry = new OpenAPIRegistry();

gameRegistry.register('Game', GameSchema);

export const gameRouter: Router = (() => {
  const router = express.Router();

  gameRegistry.registerPath({
    method: 'post',
    path: '/games/start',
    tags: ['Game'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: StartGameSchema.shape.body,
            example: { gameUuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6', score: 56 },
          },
        },
        required: true,
      },
    },
    responses: createApiResponse(z.array(PlayGameSchema.shape.body), 'Success'),
  });

  router.post('/start', validateRequest(StartGameSchema), checkPlayerIsNotBusyMiddleware, startGameMiddleware);

  gameRegistry.registerPath({
    method: 'post',
    path: '/games/play',
    tags: ['Game'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: PlayGameSchema.shape.body,
            example: { gameUuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6', score: 6 },
          },
        },
        required: true,
      },
    },
    responses: createApiResponse(z.array(PlayGameSchema.shape.body), 'Success'),
  });

  router.post('/play', validateRequest(PlayGameSchema), checkPlayerIsNotBusyMiddleware, playGameMiddleware);

  gameRegistry.registerPath({
    method: 'patch',
    path: '/games/busy',
    tags: ['Game'],
    responses: createApiResponse(PlayerAvailableSchema, 'Success'),
  });

  router.patch('/busy', setPlayerBusyMiddleware);

  return router;
})();
