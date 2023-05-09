const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden-err');
const RequestError = require('../errors/request-err');
const NotFoundError = require('../errors/not-found-err');
const DefaultError = require('../errors/default-err');

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
        throw new RequestError('Переданы некорректные данные в форме создания карточки');
      }
      throw new DefaultError('Серверная ошибка');
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const findAndRemove = () => {
    Card.findByIdAndRemove(req.params.cardId)
      .orFail()
      .then((card) => res.send(card))
      .catch((err) => {
        if (err.name === 'CastError') {
          throw new RequestError('Переданы некорректные карточки данные при запросе');
        }
        throw new DefaultError('Серверная ошибка');
      });
  };
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемые данные карточки не найдены');
      }
      if (req.user._id === card.owner.toString()) {
        return findAndRemove();
      }
      throw new ForbiddenError('Пользователи не могут удалять чужие карточки');
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемые данные карточки не найдены');
      }
      if (err.name === 'CastError') {
        throw new RequestError('Переданы некорректные данные карточки при запросе');
      }
      throw new DefaultError('Серверная ошибка');
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемые данные карточки не найдены');
      }
      if (err.name === 'CastError') {
        throw new RequestError('Переданы некорректные данные карточки при запросе');
      }
      throw new DefaultError('Серверная ошибка');
    })
    .catch(next);
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
