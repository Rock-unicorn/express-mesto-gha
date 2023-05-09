const cardsRouter = require('express').Router();

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validationCreateCard } = require('../middlewares/validation');

cardsRouter.post('/cards', validationCreateCard, createCard);
cardsRouter.get('/cards', getCards);
cardsRouter.delete('/cards/:cardId', deleteCard);
cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cardsRouter;
