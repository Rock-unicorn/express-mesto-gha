const Card = require('../models/card');
const { ERROR_CODE_BAD_REQUEST, ERROR_CODE_INTERNAL_SERVER_ERROR, ERROR_CODE_NOT_FOUND } = require('../utils/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Серверная ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные в форме создания карточки' });
      }
      return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Серверная ошибка' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемые данные карточки не найдены' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные карточки данные при запросе' });
      }
      return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Серверная ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемые данные карточки не найдены' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки при запросе' });
      }
      return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Серверная ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемые данные карточки не найдены' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки при запросе' });
      }
      return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Серверная ошибка' });
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
