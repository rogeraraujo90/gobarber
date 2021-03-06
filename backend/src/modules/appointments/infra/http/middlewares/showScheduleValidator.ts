import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';

export default function validate(): RequestHandler {
  return celebrate({
    [Segments.QUERY]: {
      day: Joi.number().required().min(1).max(31),
      month: Joi.number().required().min(1).max(12),
      year: Joi.number().required(),
    },
  });
}
