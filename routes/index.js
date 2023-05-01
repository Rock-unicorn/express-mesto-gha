const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { ERROR_CODE_NOT_FOUND } = require('../utils/errors');

router.use('/', usersRouter);
router.use('/', cardsRouter);
router.use('*', (req, res) => req.statusCode(ERROR_CODE_NOT_FOUND).send({ message: 'Данные по запросу не найдены' }));

module.exports = router;
