import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';

export default function validate(): RequestHandler {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
    }),
  });
}
