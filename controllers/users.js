const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/user');

const NotFoundError = require('../utils/errors/not-found-err');
const ConflictError = require('../utils/errors/conflict-err');
const RequestError = require('../utils/errors/request-err');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const findUserById = (id, res, next) => {
  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Запрашиваемые данные пользователя не найдены'));
      }
      return next(err);
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  findUserById(userId, res, next);
};

const getUserInfo = (req, res, next) => {
  const { userId } = req.user._id;
  findUserById(userId, res, next);
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
        .then((user) => res.status(201).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        }))
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            return next(new RequestError('Переданы некорректные данные в форме создания пользователя'));
          }
          if (err.code === 11000) {
            return next(new ConflictError('Введенный email занят'));
          }
          return next(err);
        });
    });
};

const changeProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Запрашиваемые данные пользователя не найдены'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new RequestError('Переданы некорректные данные пользователя при запросе'));
      }
      return next(err);
    });
};

const changeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Запрашиваемые данные пользователя не найдены'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new RequestError('Переданы некорректные данные пользователя при запросе'));
      }
      return next(err);
    });
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

module.exports = {
  getUsers, getUserById, createUser, changeProfile, changeAvatar, login, getUserInfo,
};
