import { z } from 'zod';

export const commonValidations = {
  validPlay: z.number().refine((num) => num == 0 || num == 1 || num == -1, 'Number must be a valid play'),
  numberGreaterThanOne: z.number().refine((num) => num > 1, 'Number must be greater than 1'),
  uuid: z.string().uuid(),
};
