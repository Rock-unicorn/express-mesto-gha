const Card = require('../models/card');
const ForbiddenError = require('../utils/errors/forbidden-err');
const RequestError = require('../utils/errors/request-err');
const NotFoundError = require('../utils/errors/not-found-err');
const DefaultError = require('../utils/errors/default-err');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные в форме создания карточки'));
      } else {
        next(new DefaultError('Серверная ошибка'));
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Запрашиваемые данные карточки не найдены'));
      }
      if (req.user._id !== card.owner.toString()) {
        next(new ForbiddenError('Пользователи не могут удалять чужие карточки'));
      }
      return card.remove().then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Переданы некорректные данные карточки при запросе'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Запрашиваемые данные карточки не найдены'));
      }
      if (err.name === 'CastError') {
        next(new RequestError('Переданы некорректные данные карточки при запросе'));
      }
      next(new DefaultError('Серверная ошибка'));
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Запрашиваемые данные карточки не найдены'));
      }
      if (err.name === 'CastError') {
        next(new RequestError('Переданы некорректные данные карточки при запросе'));
      }
      next(new DefaultError('Серверная ошибка'));
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
