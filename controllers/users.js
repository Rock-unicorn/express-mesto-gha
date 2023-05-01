const User = require('../models/user');
const { ERROR_CODE_BAD_REQUEST, ERROR_CODE_INTERNAL_SERVER_ERROR, ERROR_CODE_NOT_FOUND } = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Серверная ошибка' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемые данные пользователя не найдены' });
        return;
      }
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Серверная ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные в форме создания пользователя' });
        return;
      }
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Серверная ошибка' });
    });
};

const changeProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемые данные пользователя не найдены' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя при запросе' });
        return;
      }
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Серверная ошибка' });
    });
};

const changeAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемые данные пользователя не найдены' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя при запросе' });
        return;
      }
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Серверная ошибка' });
    });
};

module.exports = {
  getUsers, getUserById, createUser, changeProfile, changeAvatar,
};
