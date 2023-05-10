const mongoose = require('mongoose');
const Card = require('../models/card');
const ForbiddenError = require('../utils/errors/forbidden-err');
const RequestError = require('../utils/errors/request-err');
const NotFoundError = require('../utils/errors/not-found-err');

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
      if (err instanceof mongoose.Error.ValidationError) {
        next(new RequestError('Переданы некорректные данные в форме создания карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Запрашиваемые данные карточки не найдены'));
      }
      if (req.user._id !== card.owner.toString()) {
        return next(new ForbiddenError('Пользователи не могут удалять чужие карточки'));
      }
      return card;
    })
    .then((card) => Card.deleteOne(card))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new RequestError('Переданы некорректные данные карточки при запросе'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Запрашиваемые данные карточки не найдены'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new RequestError('Переданы некорректные данные карточки при запросе'));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Запрашиваемые данные карточки не найдены'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new RequestError('Переданы некорректные данные карточки при запросе'));
      }
      return next(err);
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
