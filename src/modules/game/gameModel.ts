import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@common/utils/commonValidation';

extendZodWithOpenApi(z);

export type Game = z.infer<typeof GameSchema>;

// Basically a game will be { "uuid": score }
export const GameSchema = z.record(commonValidations.uuid, commonValidations.numberGreaterThanOne);

// Input Validation for 'POST games/start' endpoint
export const StartGameSchema = z.object({
  body: z.object({ gameUuid: commonValidations.uuid, score: commonValidations.numberGreaterThanOne }),
});

// Input Validation for 'POST games/play' endpoint
export const PlayGameSchema = z.object({
  body: z.object({
    gameUuid: commonValidations.uuid,
    score: commonValidations.numberGreaterThanOne,
  }),
});

// Input Validation for 'POST games/play' endpoint
export const PlayerAvailableSchema = z.object({
  available: z.boolean(),
});
