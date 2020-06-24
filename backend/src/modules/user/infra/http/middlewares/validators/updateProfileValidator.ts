import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';

export default function validate(): RequestHandler {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      oldPassword: Joi.string(),
      password: Joi.string().min(6).when('oldPassword', {
        then: Joi.required(),
      }),
      passwordConfirmation: Joi.valid(Joi.ref('password')).when('oldPassword', {
        then: Joi.required(),
      }),
    }),
  });
}
