import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';

export default function validate(): RequestHandler {
  return celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().required().uuid(),
    },
    [Segments.QUERY]: {
      month: Joi.number().required().min(1).max(12),
      year: Joi.number().required(),
    },
  });
}
