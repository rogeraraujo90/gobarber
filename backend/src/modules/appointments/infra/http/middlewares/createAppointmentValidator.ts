import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';

export default function validate(): RequestHandler {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      providerId: Joi.string().required().uuid(),
      date: Joi.date().required(),
    }),
  });
}
