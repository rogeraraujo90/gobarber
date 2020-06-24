import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';

export default function validate(): RequestHandler {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      password: Joi.string().required(),
      email: Joi.string().email().required(),
    }),
  });
}
