const { celebrate, Joi } = require('celebrate');

const urlPattern = /(https?:\/\/)(w{3}\.)?\w+[-.~:/?#[\]@!$&'()*+,;=]*#?/;

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlPattern),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validationChangeProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validationChangeAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlPattern),
  }),
});

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlPattern),
  }),
});

const validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).hex(),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports = {
  validationLogin,
  validationCreateUser,
  validationChangeProfile,
  validationChangeAvatar,
  validationCreateCard,
  validationUserId,
  validationCardId,
};
