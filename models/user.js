const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поня "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      required: [true, 'Поле "name" обязательно к заполнению'],
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поня "about" - 2'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
      required: [true, 'Поле "about" обязательно к заполнению'],
    },
    avatar: {
      type: String,
      required: [true, 'Поле "avatar" обязательно к заполнению'],
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Введен некорректный URL',
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
