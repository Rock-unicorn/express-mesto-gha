const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthError = require('../utils/errors/auth-err');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поня "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      required: false,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поня "about" - 2'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
      required: false,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      required: false,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Введен некорректный URL',
      },
    },
    email: {
      type: String,
      required: [true, 'Поле "email" обязательно к заполнению'],
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Введен некорректный email',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" обязательно к заполнению'],
      minlength: [8, 'Минимальная длина поня "password" - 8'],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
