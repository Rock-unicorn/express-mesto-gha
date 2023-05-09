const cardsRouter = require('express').Router();

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validationCreateCard, validationCardId } = require('../middlewares/validation');

cardsRouter.post('/cards', validationCreateCard, createCard);
cardsRouter.get('/cards', getCards);
cardsRouter.delete('/cards/:cardId', validationCardId, deleteCard);
cardsRouter.put('/cards/:cardId/likes', validationCardId, likeCard);
cardsRouter.delete('/cards/:cardId/likes', validationCardId, dislikeCard);

module.exports = cardsRouter;
