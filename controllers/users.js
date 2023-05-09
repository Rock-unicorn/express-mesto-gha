const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const DefaultError = require('../errors/default-err');
const RequestError = require('../errors/request-err');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемые данные пользователя не найдены');
      }
      if (err.name === 'CastError') {
        throw new RequestError('Переданы некорректные данные пользователя при запросе');
      }
      throw new DefaultError('Серверная ошибка');
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(201).send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new RequestError('Переданы некорректные данные в форме создания пользователя');
          }
          if (err.code === 11000) {
            throw new ConflictError('Введенный email занят');
          }
          throw new DefaultError('Серверная ошибка');
        })
        .catch(next);
    });
};

const changeProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемые данные пользователя не найдены');
      }
      if (err.name === 'ValidationError') {
        throw new RequestError('Переданы некорректные данные пользователя при запросе');
      }
      if (err.name === 'CastError') {
        throw new RequestError('Переданы некорректные данные пользователя при запросе');
      }
      throw new DefaultError('Серверная ошибка');
    })
    .catch(next);
};

const changeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемые данные пользователя не найдены');
      }
      if (err.name === 'ValidationError') {
        throw new RequestError('Переданы некорректные данные пользователя при запросе');
      }
      if (err.name === 'CastError') {
        throw new RequestError('Переданы некорректные данные пользователя при запросе');
      }
      throw new DefaultError('Серверная ошибка');
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '81409eeb7b60688eff9e7e9b87fd2986878eb85aa851d4bda011e65b635ffe84', { expiresIn: '3d' });
      return res.send({ token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемые данные пользователя не найдены');
      }
      if (err.name === 'ValidationError') {
        throw new RequestError('Переданы некорректные данные пользователя при запросе');
      }
      if (err.name === 'CastError') {
        throw new RequestError('Переданы некорректные данные пользователя при запросе');
      }
      throw new DefaultError('Серверная ошибка');
    })
    .catch(next);
};

module.exports = {
  getUsers, getUserById, createUser, changeProfile, changeAvatar, login, getUserInfo,
};
