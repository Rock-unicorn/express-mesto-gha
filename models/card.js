const mongoose = require('mongoose');
const urlPattern = require('../utils/pattern');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поня "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      required: [true, 'Поле "name" обязательно к заполнению'],
    },
    link: {
      type: String,
      required: [true, 'Поле "link" обязательно к заполнению'],
      validate: {
        validator(link) {
          return urlPattern.test(link);
        },
        message: 'Введен некорректный URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
